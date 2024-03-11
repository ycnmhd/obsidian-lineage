import { ViewStore } from 'src/view/view';
import { AllDirections } from 'src/stores/view/view-store-actions';
import { saveNodeContent } from 'src/view/actions/keyboard-shortcuts/helpers/tree/save-node-content';

export const moveNode = (store: ViewStore, direction: AllDirections) => {
    saveNodeContent(store);
    store.dispatch({
        type: 'DOCUMENT/MOVE_NODE',
        payload: { direction },
    });
};
