import {
    addSnapshot,
    AddSnapshotAction,
} from 'src/features/file-histoy/reducers/add-snapshot';
import {
    UndoRedoAction,
    undoRedoSnapshot,
} from 'src/features/file-histoy/reducers/undo-redo-snapshot';
import {
    selectSnapshot,
    SelectSnapshotAction,
} from 'src/features/file-histoy/reducers/select-snapshot';
import { NodePosition } from 'src/view/store/helpers/find-branch';
import {
    updateDocumentPath,
    UpdateDocumentPathAction,
} from 'src/features/file-histoy/reducers/update-document-path';
import {
    deleteDocument,
    DeleteDocumentAction,
} from 'src/features/file-histoy/reducers/delete-document';

export type Snapshot = {
    data: string;
    created: number;
    id: string;
    position: NodePosition | null;
    actionType: string | null;
};
export type FileHistory = {
    snapshots: Snapshot[];
    activeSnapshotId: string | null;
    state: {
        canGoBack: boolean;
        canGoForward: boolean;
    };
};
export type FileHistoryState = {
    documents: {
        [path: string]: FileHistory;
    };
};
export type FileHistoryAction =
    | AddSnapshotAction
    | UndoRedoAction
    | SelectSnapshotAction
    | UpdateDocumentPathAction
    | DeleteDocumentAction;

const updateState = (state: FileHistoryState, action: FileHistoryAction) => {
    if (action.type === 'ADD_SNAPSHOT') {
        addSnapshot(state, action);
    } else if (action.type === 'SELECT_SNAPSHOT') {
        selectSnapshot(state, action);
    } else if (action.type === 'UNDO_REDO_SNAPSHOT') {
        undoRedoSnapshot(state, action);
    } else if (action.type === 'UPDATE_DOCUMENT_PATH') {
        updateDocumentPath(state, action);
    } else if (action.type === 'DELETE_DOCUMENT') {
        deleteDocument(state, action);
    }
};

export const fileHistoryReducer = (
    store: FileHistoryState,
    action: FileHistoryAction,
): FileHistoryState => {
    updateState(store, action);
    return store;
};
