import { ViewStore } from 'src/view/view';
import { Direction } from 'src/stores/view/view-store-actions';
import { saveNodeContent } from 'src/view/actions/keyboard-shortcuts/helpers/tree/save-node-content';

export const saveNodeAndInsertNode = (
    store: ViewStore,
    direction: Direction,
    content = '',
) => {
    saveNodeContent(store);
    store.dispatch({
        type: 'DOCUMENT/INSERT_NODE',
        payload: {
            position: direction,
            content,
        },
    });
};
