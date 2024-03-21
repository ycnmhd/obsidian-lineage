import { ViewStore } from 'src/view/view';
import { DocumentState } from 'src/stores/document/document-state-type';

export const enableEditMode = (
    viewStore: ViewStore,
    documentState: DocumentState,
) => {
    viewStore.dispatch({
        type: 'DOCUMENT/ENABLE_EDIT_MODE',
        payload: {
            nodeId: documentState.history.context.activeNodeId,
        },
    });
};
