import { insertNode } from 'src/stores/view/reducers/document/structure/insert-node/insert-node';
import { updateActiveNode } from 'src/stores/view/reducers/document/state/helpers/update-active-node';
import { dropNode } from 'src/stores/view/reducers/document/structure/drop-node/drop-node';
import { onDragEnd } from 'src/stores/view/reducers/document/state/on-drag-end';
import { loadDocumentFromFile } from 'src/stores/view/reducers/document/io/load-document-from-file/load-document-from-file';
import { resetDocument } from 'src/stores/view/reducers/document/io/reset-document';
import { setNodeContent } from 'src/stores/view/reducers/document/content/set-node-content';
import { onDragStart } from 'src/stores/view/reducers/document/state/on-drag-start';
import { enableEditMode } from 'src/stores/view/reducers/document/state/enable-edit-mode';
import { disableEditMode } from 'src/stores/view/reducers/document/state/disable-edit-mode';
import { navigateUsingKeyboard } from 'src/stores/view/reducers/document/state/navigate-using-keyboard';
import { deleteNode } from 'src/stores/view/reducers/document/structure/delete-node/delete-node';
import { moveNode } from 'src/stores/view/reducers/document/structure/move-node/move-node';
import { ViewState } from 'src/stores/view/view-state-type';
import { mergeNode } from 'src/stores/view/reducers/document/structure/merge-node/merge-node';
import { addSnapshot } from 'src/stores/view/reducers/history/add-snapshot';
import { selectSnapshot } from 'src/stores/view/reducers/history/select-snapshot';
import { undoAction } from 'src/stores/view/reducers/history/undo-action';
import { getViewEventType } from 'src/stores/view/helpers/get-view-event-type';
import { redoAction } from 'src/stores/view/reducers/history/redo-action';
import { addNavigationHistoryItem } from 'src/stores/view/reducers/ui/helpers/add-navigation-history-item';
import { navigateActiveNode } from 'src/stores/view/reducers/ui/navigate-active-node';
import { updateTreeState } from 'src/stores/view/reducers/document/state/helpers/update-tree-state';

import { setSearchResults } from 'src/stores/view/reducers/search/set-search-results';
import { setSearchQuery } from 'src/stores/view/reducers/search/set-search-query';
import { UndoableAction, ViewAction } from 'src/stores/view/view-store-actions';
import { toggleSearchInput } from 'src/stores/view/reducers/search/toggle-search-input';
import { changeZoomLevel } from 'src/stores/view/reducers/ui/change-zoom-level';

const updateViewState = (state: ViewState, action: ViewAction) => {
    // state
    let saveSnapshot: boolean | undefined = false;
    const activeNodeId = state.document.state.activeNode;
    let isNewNode = false;
    if (action.type === 'DOCUMENT/SET_ACTIVE_NODE') {
        updateActiveNode(state.document.state, action.payload.id);
    } else if (action.type === 'DOCUMENT/NAVIGATE_USING_KEYBOARD') {
        navigateUsingKeyboard(
            state.document.columns,
            state.document.state,
            action,
        );
    } else if (action.type === 'SET_DRAG_STARTED') {
        onDragStart(state.document.columns, state.ui.state.dnd, action);
    } else if (action.type === 'DOCUMENT/SET_DRAG_STARTED') {
        onDragEnd(state.ui.state.dnd);
    } else if (action.type === 'DOCUMENT/ENABLE_EDIT_MODE') {
        enableEditMode(state.document.state, state.ui.state);
    } else if (action.type === 'DOCUMENT/DISABLE_EDIT_MODE') {
        disableEditMode(state.ui.state);
    }
    // structure and content
    else if (action.type === 'DOCUMENT/SET_NODE_CONTENT') {
        saveSnapshot = setNodeContent(state.document.content, action);
    } else if (action.type === 'DOCUMENT/INSERT_NODE') {
        saveSnapshot = insertNode(
            state.document.columns,
            state.document.state,
            state.document.content,
            action,
        );
        isNewNode = true;
    } else if (action.type === 'DOCUMENT/DELETE_NODE') {
        saveSnapshot = deleteNode(
            state.document.columns,
            state.document.state,
            state.document.content,
            state.ui.state.editing.activeNodeId,
        );
    } else if (action.type === 'DOCUMENT/DROP_NODE') {
        saveSnapshot = dropNode(
            state.document.columns,
            state.document.state,
            action,
        );
        onDragEnd(state.ui.state.dnd);
    } else if (action.type === 'DOCUMENT/MOVE_NODE') {
        saveSnapshot = moveNode(
            state.document.columns,
            state.document.state,
            action,
        );
    } else if (action.type === 'DOCUMENT/MERGE_NODE') {
        saveSnapshot = mergeNode(
            state.document.columns,
            state.document.content,
            state.document.state,
            action,
        );
    }
    // life cycle and other
    else if (action.type === 'DOCUMENT/LOAD_FILE') {
        isNewNode = loadDocumentFromFile(state, action);
        saveSnapshot = true;
    } else if (action.type === 'RESET_STORE') {
        resetDocument(state);
    } else if (action.type === 'HISTORY/SELECT_SNAPSHOT') {
        selectSnapshot(state.document, state.history, action);
    } else if (action.type === 'HISTORY/APPLY_PREVIOUS_SNAPSHOT') {
        undoAction(state.document, state.history);
    } else if (action.type === 'HISTORY/APPLY_NEXT_SNAPSHOT') {
        redoAction(state.document, state.history);
    } else if (action.type === 'FS/SET_FILE_PATH') {
        state.file.path = action.payload.path;
    } else if (action.type === 'UI/TOGGLE_HISTORY_SIDEBAR') {
        state.ui.showHelpSidebar = false;
        state.ui.showHistorySidebar = !state.ui.showHistorySidebar;
    } else if (action.type === 'UI/TOGGLE_HELP_SIDEBAR') {
        state.ui.showHistorySidebar = false;
        state.ui.showHelpSidebar = !state.ui.showHelpSidebar;
    } else if (action.type === 'NAVIGATION/NAVIGATE_FORWARD') {
        navigateActiveNode(
            state.document.columns,
            state.document.state,
            state.navigationHistory,
            true,
        );
    } else if (action.type === 'NAVIGATION/NAVIGATE_BACK') {
        navigateActiveNode(
            state.document.columns,
            state.document.state,
            state.navigationHistory,
        );
    } else if (action.type === 'SEARCH/SET_QUERY') {
        setSearchQuery(state, action.payload.query);
    } else if (action.type === 'SEARCH/SET_RESULTS') {
        setSearchResults(state, action.payload.results);
    } else if (action.type === 'SEARCH/TOGGLE_INPUT') {
        toggleSearchInput(state);
    } else if (action.type === 'UI/CHANGE_ZOOM_LEVEL') {
        changeZoomLevel(state, action.payload);
    }

    const event = getViewEventType(action.type);
    const contentShapeCreation =
        event.content || event.shape || event.creationAndDeletion;
    if (saveSnapshot && contentShapeCreation) {
        addSnapshot(
            state.document,
            state.history,
            action as UndoableAction,
            activeNodeId,
        );
    }
    if (
        contentShapeCreation ||
        event.activeNodeHistory ||
        event.changeHistory ||
        event.activeNode
    )
        updateTreeState(
            state.document.columns,
            state.ui.state,
            state.document.state.activeNode,
            isNewNode,
        );
    if (!event.activeNodeHistory) {
        addNavigationHistoryItem(
            state.navigationHistory,
            state.document.content,
            state.document.state.activeNode,
        );
    }
};

export const viewReducer = (
    store: ViewState,
    action: ViewAction,
): ViewState => {
    updateViewState(store, action);
    return store;
};
