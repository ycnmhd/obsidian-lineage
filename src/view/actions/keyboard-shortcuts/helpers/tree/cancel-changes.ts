import { ViewStore } from 'src/view/view';
import { activeTextArea } from 'src/view/components/container/column/components/group/components/card/actions/save-node-content-action';

export const cancelChanges = (store: ViewStore) => {
    activeTextArea.nodeId = null;
    store.dispatch({
        type: 'DOCUMENT/DISABLE_EDIT_MODE',
    });
};
