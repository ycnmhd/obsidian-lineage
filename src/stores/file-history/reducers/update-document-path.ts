import { FileHistoryState } from 'src/stores/file-history/file-history-reducer';

export type UpdateDocumentPathAction = {
    type: 'UPDATE_DOCUMENT_PATH';
    payload: {
        oldPath: string;
        newPath: string;
    };
};
export const updateDocumentPath = (
    store: FileHistoryState,
    action: UpdateDocumentPathAction,
) => {
    const document = store.documents[action.payload.oldPath];
    if (document) {
        delete store.documents[action.payload.oldPath];
        store.documents[action.payload.newPath] = document;
    }
};
