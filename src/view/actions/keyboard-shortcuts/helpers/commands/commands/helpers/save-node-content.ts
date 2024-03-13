import { LineageView } from 'src/view/view';
import { getTextAreaOfView } from 'src/view/actions/keyboard-shortcuts/helpers/commands/commands/helpers/get-text-area-of-view';
import invariant from 'tiny-invariant';

export const saveNodeContent = (view: LineageView) => {
    const textArea = getTextAreaOfView(view);
    if (textArea) {
        const content = textArea.value;
        const nodeId = textArea.dataset.nodeId;
        invariant(nodeId, 'textarea does not have a node id');
        view.store.dispatch({
            type: 'DOCUMENT/SET_NODE_CONTENT',
            payload: {
                nodeId: nodeId,
                content: content,
            },
        });
        view.store.dispatch({
            type: 'DOCUMENT/DISABLE_EDIT_MODE',
        });
    }
};
