import { ViewStore } from 'src/view/view';
import { DocumentState } from 'src/stores/document/document-state-type';

export const removeObsoleteNavigationItems = (
    viewStore: ViewStore,
    documentState: DocumentState,
) => {
    viewStore.dispatch({
        type: 'NAVIGATION/REMOVE_OBSOLETE',
        payload: {
            content: documentState.document.content,
        },
    });
};
