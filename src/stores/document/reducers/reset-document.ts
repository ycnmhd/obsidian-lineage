import { DocumentState } from 'src/stores/document/document-type';
import { defaultDocumentState } from 'src/stores/document/default-document-state';

export const resetDocument = (state: DocumentState) => {
    const newState = defaultDocumentState();
    state.state = {
        ...newState.state,
    };
    state.document = newState.document;
};
