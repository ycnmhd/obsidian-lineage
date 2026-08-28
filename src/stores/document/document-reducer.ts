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
import { formatHeadings } from 'src/stores/document/reducers/content/format-content/format-headings';
import { pasteNode } from 'src/stores/document/reducers/clipboard/paste-node/paste-node';
import { updateSectionsDictionary } from 'src/stores/document/reducers/state/update-sections-dictionary';
import { getIdOfSection } from 'src/stores/view/subscriptions/helpers/get-id-of-section';
import { removeExtractedBranch } from 'src/stores/document/reducers/extract-node/remove-extracted-branch';
import { getSectionOfId } from 'src/stores/view/subscriptions/helpers/get-section-of-id';
import { splitNode } from 'src/stores/document/reducers/split-node/split-node';
import { pinNode } from 'src/stores/document/reducers/pinned-nodes/pin-node';
import { unpinNode } from 'src/stores/document/reducers/pinned-nodes/unpin-node';
import { removeStalePinnedNodes } from 'src/stores/document/reducers/pinned-nodes/remove-stale-pinned-nodes';
import { loadPinnedNodes } from 'src/stores/document/reducers/pinned-nodes/load-pinned-nodes';
import { setCategory } from 'src/stores/document/reducers/pinned-nodes/set-category';
import { removeCategory } from 'src/stores/document/reducers/pinned-nodes/remove-category';
import { addCategory } from 'src/stores/document/reducers/pinned-nodes/add-category';
import { deleteCategory } from 'src/stores/document/reducers/pinned-nodes/delete-category';
import { refreshGroupParentIds } from 'src/stores/document/reducers/meta/refresh-group-parent-ids';
import { loadDocumentFromJSON } from 'src/stores/document/reducers/load-document-from-file/load-document-from-json';
import { NO_UPDATE } from 'src/lib/store/store';
import { sortDirectChildNodes } from 'src/stores/document/reducers/sort/sort-direct-child-nodes';

const updateDocumentState = (
    state: DocumentState,
    action: DocumentStoreAction,
) => {
    let newActiveNodeId: null | string = null;
    let affectedNodeId: null | string = null;
    let affectedNodeContent: Content[string] | null = null;
    let affectedNodes: string[] | undefined = undefined;
    if (action.type === 'document/update-node-content') {
        const update = setNodeContent(state.document.content, action);
        if (!update) return NO_UPDATE;
        newActiveNodeId = action.payload.nodeId;
    } else if (action.type === 'document/add-node') {
        newActiveNodeId = insertNode(
            state.document,
            action.payload.position,
            action.payload.activeNodeId,
            action.payload.content,
        );
    } else if (action.type === 'document/delete-node') {
        affectedNodeContent =
            state.document.content[action.payload.activeNodeId];
        newActiveNodeId = deleteNode(
            state.document,
            action.payload.activeNodeId,
            action.payload.selectedNodes,
        );
        affectedNodeId = action.payload.activeNodeId;
    } else if (action.type === 'document/extract-node') {
        affectedNodeContent = state.document.content[action.payload.nodeId];
        const update = setNodeContent(state.document.content, {
            payload: {
                nodeId: action.payload.nodeId,
                content: `[[${action.payload.documentName}]]`,
            },
        });
        if (!update) return NO_UPDATE;
        removeExtractedBranch(state.document, action);
        newActiveNodeId = action.payload.nodeId;
    } else if (action.type === 'document/split-node') {
        affectedNodeId = action.payload.target;
        affectedNodeContent = state.document.content[affectedNodeId];
        newActiveNodeId = splitNode(state.document, action);
    } else if (action.type === 'document/drop-node') {
        dropNode(state.document, action);
        newActiveNodeId = action.payload.droppedNodeId;
    } else if (action.type === 'document/move-node') {
        moveNode(state.document, action);
        newActiveNodeId = action.payload.activeNodeId;
        affectedNodeId = newActiveNodeId;
    } else if (action.type === 'document/merge-node') {
        affectedNodeContent =
            state.document.content[action.payload.activeNodeId];
        newActiveNodeId = mergeNode(state.document, action);
        affectedNodeId = action.payload.activeNodeId;
    } else if (action.type === 'document/sort-direct-child-nodes') {
        sortDirectChildNodes(state.document, action.payload);
        newActiveNodeId = action.payload.id;
        affectedNodeId = newActiveNodeId;
    } else if (action.type === 'document/file/load-from-disk') {
        if (action.payload.__test_document__) {
            newActiveNodeId = loadDocumentFromJSON(
                state,
                action.payload.__test_document__,
            );
        } else {
            newActiveNodeId = loadDocumentFromFile(state, action);
        }
    } else if (action.type === 'document/history/select-snapshot') {
        selectSnapshot(state.document, state.history, action);
        state.history = { ...state.history };
    } else if (action.type === 'document/history/select-previous-snapshot') {
        undoAction(state.document, state.history);
        state.history = { ...state.history };
    } else if (action.type === 'document/history/select-next-snapshot') {
        redoAction(state.document, state.history);
        state.history = { ...state.history };
    } else if (action.type === 'document/format-headings') {
        formatHeadings(state.document.content, state.sections);
        newActiveNodeId = getIdOfSection(
            state.sections,
            state.history.context.activeSection,
        );
    } else if (action.type === 'document/paste-node') {
        const result = pasteNode(state.document, action);
        newActiveNodeId = result.nextNode;
        affectedNodes = result.rootNodes;
    } else if (action.type === 'document/cut-node') {
        affectedNodeContent = state.document.content[action.payload.nodeId];
        newActiveNodeId = deleteNode(
            state.document,
            action.payload.nodeId,
            action.payload.selectedNodes,
        );
        affectedNodeId = action.payload.nodeId;
    } else if (action.type === 'document/file/update-frontmatter') {
        state.file.frontmatter = action.payload.frontmatter;
        return;
    } else if (action.type === 'document/pinned-nodes/pin') {
        pinNode(state.sections, state.pinnedNodes, action.payload.id);
        return;
    } else if (action.type === 'document/pinned-nodes/unpin') {
        unpinNode(state.pinnedNodes, action.payload.id);
        return;
    } else if (action.type === 'document/pinned-nodes/remove-stale-nodes') {
        removeStalePinnedNodes(
            state.pinnedNodes,
            state.sections,
            action.payload?.oldSections,
        );
        return;
    } else if (action.type === 'document/pinned-nodes/load-from-settings') {
        loadPinnedNodes(
            state.pinnedNodes,
            state.sections,
            action.payload,
        );
        return;
    } else if (action.type === 'document/pinned-nodes/set-category') {
        setCategory(state.pinnedNodes, action.payload.id, action.payload.category);
        return;
    } else if (action.type === 'document/pinned-nodes/remove-category') {
        removeCategory(state.pinnedNodes, action.payload.id);
        return;
    } else if (action.type === 'document/pinned-nodes/add-category') {
        addCategory(state.pinnedNodes, action.payload.name);
        return;
    } else if (action.type === 'document/pinned-nodes/delete-category') {
        deleteCategory(state.pinnedNodes, action.payload.name);
        return;
    } else if (action.type === 'document/meta/refresh-group-parent-ids') {
        refreshGroupParentIds(state.document.columns, state.meta);
        return;
    }

    const e = getDocumentEventType(action.type);

    let affectedSection: string | null = null;

    if (affectedNodeId) {
        affectedSection = getSectionOfId(state.sections, affectedNodeId);
    }
    if (e.dropOrMove || e.createOrDelete || e.changeHistory || e.clipboard) {
        updateSectionsDictionary(state);
    }

    // if file was modified externally, try to maintain active section
    if (action.type === 'document/file/load-from-disk') {
        const activeSection = action.payload.activeSection;
        if (activeSection) {
            const id = state.sections.section_id[activeSection];
            if (id) {
                newActiveNodeId = id;
            }
        }
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
            affectedSections: affectedNodes
                ? affectedNodes.map((id) => state.sections.id_section[id])
                : undefined,
        };
        addSnapshot(state.document, state.history, context);
        state.history = { ...state.history };
    }
};

export const documentReducer = (
    store: DocumentState,
    action: DocumentStoreAction,
) => {
    const result = updateDocumentState(store, action);
    if (result === NO_UPDATE) return NO_UPDATE;
    return store;
};
