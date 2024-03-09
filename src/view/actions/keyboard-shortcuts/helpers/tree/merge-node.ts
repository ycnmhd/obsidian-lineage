import { ViewStore } from 'src/view/view';
import { VerticalDirection } from 'src/stores/view/view-store-actions';
import { saveNodeContent } from 'src/view/actions/keyboard-shortcuts/helpers/tree/save-node-content';

export const mergeNode = (store: ViewStore, direction: VerticalDirection) => {
    saveNodeContent(store);
    store.dispatch({
        type: 'DOCUMENT/MERGE_NODE',
        payload: { direction },
    });
};
