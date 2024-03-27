import { ViewStore } from 'src/view/view';
import { DocumentState } from 'src/stores/document/document-state-type';

export const setActiveNode = (
    viewStore: ViewStore,
    documentState: DocumentState,
) => {
    viewStore.dispatch({
        type: 'DOCUMENT/SET_ACTIVE_NODE',
        payload: {
            id: documentState.history.context.activeNodeId,
        },
    });
};
