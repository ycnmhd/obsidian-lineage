import { ViewStore } from 'src/view/view';
import { getViewEventType } from 'src/stores/view/helpers/get-view-event-type';
import { calculateColumnTreeIndexes } from 'src/stores/view/effects/file/update-tree-index/calculate-tree-index';

export const updateTreeIndexEffect = (store: ViewStore) => {
    return store.subscribe((state, action, initialRun) => {
        const eventType = action ? getViewEventType(action.type) : null;
        if (
            initialRun ||
            (eventType &&
                (eventType.creationAndDeletion ||
                    eventType.shape ||
                    eventType.changeHistory))
        ) {
            store.dispatch({
                type: 'UI/SET_TREE_INDEX',
                payload: {
                    treeIndex: calculateColumnTreeIndexes(
                        state.document.columns,
                    ),
                },
            });
        }
    });
};
