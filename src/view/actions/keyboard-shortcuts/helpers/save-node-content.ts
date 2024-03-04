import { ViewStore } from 'src/view/view';
import { activeTextArea } from 'src/view/components/container/column/components/group/components/card/actions/save-node-content';

export const saveNodeContent = (store: ViewStore) => {
    if (activeTextArea.nodeId && activeTextArea.element) {
        const content = activeTextArea.element.value;
        store.dispatch({
            type: 'DOCUMENT/SET_NODE_CONTENT',
            payload: {
                nodeId: activeTextArea.nodeId,
                content: content,
            },
        });
    }
    store.dispatch({
        type: 'DOCUMENT/DISABLE_EDIT_MODE',
    });
};
