import { DocumentState } from 'src/view/store/document-reducer';
import { initialDocumentState } from 'src/view/store/helpers/initial-document-state';

export const resetDocument = (state: DocumentState) => {
    const newState = initialDocumentState();
    state.state = newState.state;
    state.columns = newState.columns;
};
