import { LineageView } from 'src/view/view';
import { discardChanges } from 'src/view/actions/keyboard-shortcuts/helpers/commands/commands/helpers/cancel-changes';
import { inlineEditorViews } from 'src/view/actions/inline-editor/load-inline-editor';
import invariant from 'tiny-invariant';

export const saveNodeContent = (view: LineageView) => {
    const inlineView = inlineEditorViews.get(view);
    if (inlineView) {
        const content = inlineView.view.editor.getValue();
        const nodeId = inlineView.nodeId;
        invariant(nodeId);
        discardChanges(view);
        view.viewStore.dispatch({
            type: 'DOCUMENT/DISABLE_EDIT_MODE',
        });
        view.documentStore.dispatch({
            type: 'DOCUMENT/SET_NODE_CONTENT',
            payload: {
                nodeId: nodeId,
                content: content,
            },
        });
    }
};
