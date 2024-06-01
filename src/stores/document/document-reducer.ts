import { insertNode } from 'src/stores/document/reducers/insert-node/insert-node';
import { dropNode } from 'src/stores/document/reducers/drop-node/drop-node';
import { loadDocumentFromFile } from 'src/stores/document/reducers/load-document-from-file/load-document-from-file';
import { setNodeContent } from 'src/stores/document/reducers/content/set-node-content';
import { deleteNode } from 'src/stores/document/reducers/delete-node/delete-node';
import { moveNode } from 'src/stores/document/reducers/move-node/move-node';
import {
    Content,
    DocumentState,
    SnapshotContext,
} from 'src/stores/document/document-state-type';
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
import { formatHeadings } from 'src/stores/document/reducers/content/format-content/format-headings';
import { pasteNode } from 'src/stores/document/reducers/clipboard/paste-node/paste-node';
import { updateSectionsDictionary } from 'src/stores/document/reducers/state/update-sections-dictionary';
import { getIdOfSection } from 'src/stores/view/subscriptions/actions/get-id-of-section';
import { extractNode } from 'src/stores/document/reducers/extract-node/extract-node';
import { getSectionOfId } from 'src/stores/view/subscriptions/actions/get-section-of-id';
import { splitNode } from 'src/stores/document/reducers/split-node/split-node';

const updateDocumentState = (
    state: DocumentState,
    action: DocumentStoreAction,
) => {
    let newActiveNodeId: null | string = null;
    let affectedNodeId: null | string = null;
    let affectedNodeContent: Content[string] | null = null;
    if (action.type === 'DOCUMENT/SET_NODE_CONTENT') {
        setNodeContent(state.document.content, action);
        newActiveNodeId = action.payload.nodeId;
    } else if (action.type === 'DOCUMENT/INSERT_NODE') {
        newActiveNodeId = insertNode(state.document, action);
    } else if (action.type === 'DOCUMENT/DELETE_NODE') {
        affectedNodeContent =
            state.document.content[action.payload.activeNodeId];
        newActiveNodeId = deleteNode(
            state.document,
            action.payload.activeNodeId,
        );
        affectedNodeId = action.payload.activeNodeId;
    } else if (action.type === 'DOCUMENT/EXTRACT_BRANCH') {
        affectedNodeContent = state.document.content[action.payload.nodeId];
        extractNode(state.document, action);
        newActiveNodeId = action.payload.nodeId;
    } else if (action.type === 'DOCUMENT/SPLIT_NODE') {
        affectedNodeId = action.payload.target;
        affectedNodeContent = state.document.content[affectedNodeId];
        newActiveNodeId = splitNode(state.document, action);
    } else if (action.type === 'DOCUMENT/DROP_NODE') {
        dropNode(state.document, action);
        newActiveNodeId = action.payload.droppedNodeId;
    } else if (action.type === 'DOCUMENT/MOVE_NODE') {
        moveNode(state.document, action);
        newActiveNodeId = action.payload.activeNodeId;
        affectedNodeId = newActiveNodeId;
    } else if (action.type === 'DOCUMENT/MERGE_NODE') {
        affectedNodeContent =
            state.document.content[action.payload.activeNodeId];
        newActiveNodeId = mergeNode(state.document, action);
        affectedNodeId = action.payload.activeNodeId;
    } else if (action.type === 'DOCUMENT/LOAD_FILE') {
        newActiveNodeId = loadDocumentFromFile(state, action);
    } else if (action.type === 'RESET_STORE') {
        const newState = defaultDocumentState();
        state.document = newState.document;
        state.history = newState.history;
        state.file = newState.file;
    } else if (action.type === 'HISTORY/SELECT_SNAPSHOT') {
        selectSnapshot(state.document, state.history, action);
        state.history = { ...state.history };
    } else if (action.type === 'HISTORY/APPLY_PREVIOUS_SNAPSHOT') {
        undoAction(state.document, state.history);
        state.history = { ...state.history };
    } else if (action.type === 'HISTORY/APPLY_NEXT_SNAPSHOT') {
        redoAction(state.document, state.history);
        state.history = { ...state.history };
    } else if (action.type === 'FS/SET_FILE_PATH') {
        state.file.path = action.payload.path;
    } else if (action.type === 'DOCUMENT/FORMAT_HEADINGS') {
        formatHeadings(state.document.content, state.sections);
        newActiveNodeId = getIdOfSection(
            state.sections,
            state.history.context.activeSection,
        );
    } else if (action.type === 'DOCUMENT/PASTE_NODE') {
        newActiveNodeId = pasteNode(state.document, action);
    } else if (action.type === 'DOCUMENT/CUT_NODE') {
        affectedNodeContent = state.document.content[action.payload.nodeId];
        newActiveNodeId = deleteNode(state.document, action.payload.nodeId);
        affectedNodeId = action.payload.nodeId;
    }

    const e = getDocumentEventType(action.type);

    let affectedSection: string | null = null;

    if (affectedNodeId) {
        affectedSection = getSectionOfId(state.sections, affectedNodeId);
    }
    if (e.dropOrMove || e.createOrDelete || e.changeHistory || e.clipboard) {
        updateSectionsDictionary(state);
    }

    const contentShapeCreation = e.content || e.dropOrMove || e.createOrDelete;
    if (newActiveNodeId && (contentShapeCreation || e.clipboard)) {
        const newActiveSection = getSectionOfId(
            state.sections,
            newActiveNodeId,
        );
        affectedNodeId = affectedNodeId || newActiveNodeId;
        affectedNodeContent =
            affectedNodeContent || state.document.content[affectedNodeId];

        const context: SnapshotContext = {
            numberOfSections: Object.keys(state.document.content).length,
            affectedSection: affectedSection || newActiveSection,
            newActiveSection,
            action: action as UndoableAction,
            contentOfAffectedSection:
                affectedNodeContent?.content?.substring(0, 300) || '',
            numberOfCharacters: Object.values(state.document.content)
                .map((x) => x.content.length)
                .reduce((acc, v) => acc + v),
        };
        addSnapshot(state.document, state.history, context);
        state.history = { ...state.history };
    }
};

export const documentReducer = (
    store: DocumentState,
    action: DocumentStoreAction,
): DocumentState => {
    updateDocumentState(store, action);
    return store;
};
