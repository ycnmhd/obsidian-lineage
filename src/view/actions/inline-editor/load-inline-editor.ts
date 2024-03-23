import { MarkdownView } from 'obsidian';
import { LineageView } from 'src/view/view';
import { InlineEditor } from 'src/obsidian/helpers/inline-editor';
import { adjustHeight } from 'src/view/actions/inline-editor/expandable-textarea-action';

export const inlineEditorViews: Map<
    LineageView,
    { view: InlineMarkdownView; nodeId: string }
> = new Map();

export type InlineMarkdownView = MarkdownView & {
    __setViewData__: MarkdownView['setViewData'];
};
const noop = async () => {};

export const loadInlineEditor = (
    target: HTMLElement,
    { nodeId, view }: { view: LineageView; nodeId: string },
) => {
    const editor = new InlineEditor(target, view);

    if (!view.file) return;
    editor.leaf
        .openFile(view.file, {
            state: {
                inlineEditor: true,
            },
        })
        .then(() => {
            const inlineView = editor.leaf.view as InlineMarkdownView;
            inlineEditorViews.set(view, { view: inlineView, nodeId });
            const content =
                view.documentStore.getValue().document.content[nodeId];

            inlineView.save = noop;
            inlineView.requestSave = noop;
            inlineView.setViewData(content?.content || '', true);
            inlineView.__setViewData__ = inlineView.setViewData;
            inlineView.setViewData = noop;
            inlineView.editor.setCursor({
                line: inlineView.editor.lastLine(),
                ch: inlineView.editor.getLine(inlineView.editor.lastLine())
                    .length,
            });
            inlineView.editor.focus();
            setTimeout(() => {
                const editor = target.querySelector(
                    '.cm-scroller',
                ) as HTMLElement;
                if (editor) adjustHeight(target, editor);
            }, 16);
        });
    return {
        destroy: () => {
            const inlineView = inlineEditorViews.get(view);
            if (inlineView) {
                view.documentStore.dispatch({
                    type: 'DOCUMENT/SET_NODE_CONTENT',
                    payload: {
                        nodeId,
                        content: inlineView.view.editor.getValue(),
                    },
                });
                inlineEditorViews.delete(view);
            }
        },
    };
};
