import { WorkspaceLeaf, WorkspaceSplit } from 'obsidian';
import { LineageView } from 'src/view/view';

export class InlineEditor {
    rootSplit: WorkspaceSplit & { containerEl: HTMLElement };
    leaf: WorkspaceLeaf;

    constructor(
        private container: HTMLElement,
        private view: LineageView,
    ) {
        this.onload();
    }

    onload() {
        const workspace = this.view.plugin.app.workspace;
        // @ts-ignore
        this.rootSplit = new WorkspaceSplit(workspace, 'vertical');
        this.rootSplit.getRoot = () => workspace.rootSplit;
        this.rootSplit.getContainer = () => workspace.rootSplit;
        this.container.append(this.rootSplit.containerEl);
        this.rootSplit.containerEl.addClasses([
            'lineage__inline-editor',
            'native-scrollbars',
        ]);
        this.leaf = workspace.createLeafInParent(this.rootSplit, 0);
    }
}
