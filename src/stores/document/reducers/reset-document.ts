import { DocumentState } from 'src/stores/document/document-reducer';
import { defaultDocumentState } from 'src/stores/document/default-document-state';

export const resetDocument = (state: DocumentState) => {
    const newState = defaultDocumentState();
    state.state = {
        ...newState.state,
        ui: state.state.ui,
    };
    state.columns = newState.columns;
};
