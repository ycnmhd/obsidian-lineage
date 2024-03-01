import {
    addSnapshot,
    AddSnapshotAction,
} from 'src/stores/file-history/reducers/add-snapshot';
import {
    UndoRedoAction,
    undoRedoSnapshot,
} from 'src/stores/file-history/reducers/undo-redo-snapshot';
import {
    selectSnapshot,
    SelectSnapshotAction,
} from 'src/stores/file-history/reducers/select-snapshot';
import { NodePosition } from 'src/stores/document/helpers/search/find-node-position';
import {
    updateDocumentPath,
    UpdateDocumentPathAction,
} from 'src/stores/file-history/reducers/update-document-path';
import {
    deleteDocument,
    DeleteDocumentAction,
} from 'src/stores/file-history/reducers/delete-document';

export type Snapshot = {
    data: string;
    created: number;
    id: string;
    position: NodePosition | null;
    actionType: string | null;
};
export type FileHistory = {
    snapshots: Snapshot[];
    state: {
        activeIndex: number;
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
