import { ViewStore } from 'src/view/view';
import { DocumentState } from 'src/stores/document/document-state-type';
import { calculateColumnTreeIndexes } from 'src/stores/view/subscriptions/helpers/calculate-tree-index';

export const setTreeIndex = (
    viewStore: ViewStore,
    documentState: DocumentState,
) => {
    viewStore.dispatch({
        type: 'UI/SET_TREE_INDEX',
        payload: {
            treeIndex: calculateColumnTreeIndexes(
                documentState.document.columns,
            ),
        },
    });
};
