import { insertNode } from 'src/stores/document/reducers/insert-node/insert-node';
import { dropNode } from 'src/stores/document/reducers/drop-node/drop-node';
import { loadDocumentFromFile } from 'src/stores/document/reducers/load-document-from-file/load-document-from-file';
import { setNodeContent } from 'src/stores/document/reducers/content/set-node-content';
import { deleteNode } from 'src/stores/document/reducers/delete-node/delete-node';
import { moveNode } from 'src/stores/document/reducers/move-node/move-node';
import { DocumentState } from 'src/stores/document/document-state-type';
import { mergeNode } from 'src/stores/document/reducers/merge-node/merge-node';
import { addSnapshot } from 'src/stores/document/reducers/history/add-snapshot';
import { selectSnapshot } from 'src/stores/document/reducers/history/select-snapshot';
import { undoAction } from 'src/stores/document/reducers/history/undo-action';
import { getDocumentEventType } from 'src/stores/view/helpers/get-document-event-type';
import { redoAction } from 'src/stores/document/reducers/history/redo-action';

import {
    DocumentStoreAction,
    UndoableAction,
} from 'src/stores/document/document-store-actions';
import { defaultDocumentState } from 'src/stores/document/default-document-state';

const updateDocumentState = (
    state: DocumentState,
    action: DocumentStoreAction,
) => {
    let skipSnapshot: boolean | undefined = false;
    let activeNodeId: null | string = null;
    if (action.type === 'DOCUMENT/SET_NODE_CONTENT') {
        skipSnapshot = setNodeContent(state.document.content, action);
        activeNodeId = action.payload.nodeId;
    } else if (action.type === 'DOCUMENT/INSERT_NODE') {
        activeNodeId = insertNode(
            state.document.columns,
            state.document.content,
            action,
        );
    } else if (action.type === 'DOCUMENT/DELETE_NODE') {
        activeNodeId = deleteNode(
            state.document.columns,
            state.document.content,
            action.payload.activeNodeId,
        );
    } else if (action.type === 'DOCUMENT/DROP_NODE') {
        dropNode(state.document.columns, action);
        activeNodeId = action.payload.droppedNodeId;
    } else if (action.type === 'DOCUMENT/MOVE_NODE') {
        skipSnapshot = moveNode(state.document.columns, action);
        activeNodeId = action.payload.activeNodeId;
    } else if (action.type === 'DOCUMENT/MERGE_NODE') {
        activeNodeId = mergeNode(
            state.document.columns,
            state.document.content,
            action,
        );
    } else if (action.type === 'DOCUMENT/LOAD_FILE') {
        activeNodeId = loadDocumentFromFile(state, action);
    } else if (action.type === 'RESET_STORE') {
        const newState = defaultDocumentState();
        state.document = newState.document;
        state.history = newState.history;
        state.file = newState.file;
    } else if (action.type === 'HISTORY/SELECT_SNAPSHOT') {
        selectSnapshot(state.document, state.history, action);
    } else if (action.type === 'HISTORY/APPLY_PREVIOUS_SNAPSHOT') {
        undoAction(state.document, state.history);
    } else if (action.type === 'HISTORY/APPLY_NEXT_SNAPSHOT') {
        redoAction(state.document, state.history);
    } else if (action.type === 'FS/SET_FILE_PATH') {
        state.file.path = action.payload.path;
    }

    const eventType = getDocumentEventType(action.type);
    const contentShapeCreation =
        eventType.content || eventType.shape || eventType.creationAndDeletion;
    if (!skipSnapshot && activeNodeId && contentShapeCreation) {
        addSnapshot(
            state.document,
            state.history,
            action as UndoableAction,
            activeNodeId,
        );
    }
};

export const documentReducer = (
    store: DocumentState,
    action: DocumentStoreAction,
): DocumentState => {
    updateDocumentState(store, action);
    return store;
};
