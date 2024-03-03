import { ViewState } from 'src/stores/document/document-type';
import { defaultDocumentState } from 'src/stores/document/default-document-state';

export const resetDocument = (state: ViewState) => {
    const newState = defaultDocumentState();
    state.document = newState.document;
};
