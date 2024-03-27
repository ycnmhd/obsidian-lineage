import { MarkdownView, TFile, WorkspaceLeaf, WorkspaceSplit } from 'obsidian';
import { LineageView } from 'src/view/view';
import { adjustHeight } from 'src/view/actions/inline-editor/expandable-textarea-action';

const noop = async () => {};

export type InlineMarkdownView = MarkdownView & {
    __setViewData__: MarkdownView['setViewData'];
};

export class InlineEditor {
    rootSplit: WorkspaceSplit & { containerEl: HTMLElement };
    leaf: WorkspaceLeaf;
    private nodeId: string | null = null;
    private target: HTMLElement | null = null;
    constructor(private view: LineageView) {
        this.onload();
    }

    get activeNode() {
        return this.nodeId;
    }

    getContent() {
        const inlineView = this.leaf.view as InlineMarkdownView;
        return inlineView.editor.getValue();
    }

    getCursor() {
        const inlineView = this.leaf.view as InlineMarkdownView;
        return inlineView.editor.getCursor();
    }

    setContent(content: string) {
        const inlineView = this.leaf.view as InlineMarkdownView;
        inlineView.__setViewData__(content, true);
    }

    async loadFile(file: TFile) {
        await this.leaf.openFile(file, {
            state: {
                inlineEditor: true,
            },
        });
        const inlineView = this.leaf.view as InlineMarkdownView;
        inlineView.save = noop;
        inlineView.requestSave = noop;
        inlineView.__setViewData__ = inlineView.setViewData;
        inlineView.setViewData = noop;
    }
    loadNode(target: HTMLElement, nodeId: string) {
        const inlineView = this.leaf.view as InlineMarkdownView;
        const content =
            this.view.documentStore.getValue().document.content[nodeId];
        this.setContent(content?.content || '');
        inlineView.editor.setCursor({
            line: inlineView.editor.lastLine(),
            ch: inlineView.editor.getLine(inlineView.editor.lastLine()).length,
        });
        target.append(this.rootSplit.containerEl);
        inlineView.editor.focus();
        const editor = target.querySelector('.cm-scroller') as HTMLElement;
        if (editor) adjustHeight(target, editor);
        this.nodeId = nodeId;
        this.target = target;
    }

    unloadNode() {
        this.nodeId = null;
        if (this.target) this.target.empty();
        this.target = null;
    }

    private onload() {
        const workspace = this.view.plugin.app.workspace;
        // @ts-ignore
        this.rootSplit = new WorkspaceSplit(workspace, 'vertical');
        this.rootSplit.getRoot = () => workspace.rootSplit;
        this.rootSplit.getContainer = () => workspace.rootSplit;
        this.rootSplit.containerEl.addClasses(['lineage-inline-editor']);
        this.leaf = workspace.createLeafInParent(this.rootSplit, 0);
    }
}
