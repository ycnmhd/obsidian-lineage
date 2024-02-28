import { DocumentState } from 'src/stores/document/document-reducer';
import { initialDocumentState } from 'src/stores/document/helpers/initial-document-state';

export const resetDocument = (state: DocumentState) => {
    const newState = initialDocumentState();
    state.state = {
        ...newState.state,
        ui: state.state.ui,
    };
    state.columns = newState.columns;
};
