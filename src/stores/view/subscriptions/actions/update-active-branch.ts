import { ViewStore } from 'src/view/view';
import { DocumentState } from 'src/stores/document/document-state-type';

export const updateActiveBranch = (
    viewStore: ViewStore,
    documentState: DocumentState,
) => {
    viewStore.dispatch({
        type: 'UPDATE_ACTIVE_BRANCH',
        payload: {
            columns: documentState.document.columns,
        },
    });
};
