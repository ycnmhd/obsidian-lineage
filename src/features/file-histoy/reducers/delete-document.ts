import { FileHistoryState } from 'src/features/file-histoy/file-history-reducer';

export type DeleteDocumentAction = {
    type: 'DELETE_DOCUMENT';
    payload: {
        path: string;
    };
};

export const deleteDocument = (
    store: FileHistoryState,
    action: DeleteDocumentAction,
) => {
    const { path } = action.payload;
    if (store.documents[path]) {
        delete store.documents[path];
    }
};
