import {
    CreateNodeAction,
    insertNode,
} from 'src/stores/view/reducers/document/structure/insert-node/insert-node';
import { updateActiveNode } from 'src/stores/view/reducers/document/state/helpers/update-active-node';
import {
    DropAction,
    dropNode,
} from 'src/stores/view/reducers/document/structure/drop-node/drop-node';
import {
    onDragEnd,
    SetDragCanceled,
} from 'src/stores/view/reducers/document/state/on-drag-end';
import {
    LoadDocumentAction,
    loadDocumentFromFile,
} from 'src/stores/view/reducers/document/io/load-document-from-file/load-document-from-file';
import { resetDocument } from 'src/stores/view/reducers/document/io/reset-document';
import {
    setNodeContent,
    SetNodeContentAction,
} from 'src/stores/view/reducers/document/content/set-node-content';
import {
    onDragStart,
    SetDragStartedAction,
} from 'src/stores/view/reducers/document/state/on-drag-start';
import {
    enableEditMode,
    ToggleEditModeAction,
} from 'src/stores/view/reducers/document/state/enable-edit-mode';
import {
    disableEditMode,
    DisableEditModeAction,
} from 'src/stores/view/reducers/document/state/disable-edit-mode';
import {
    ChangeActiveNodeAction,
    navigateUsingKeyboard,
} from 'src/stores/view/reducers/document/state/navigate-using-keyboard';
import {
    deleteNode,
    DeleteNodeAction,
} from 'src/stores/view/reducers/document/structure/delete-node/delete-node';
import { NodePosition } from 'src/stores/view/helpers/search/find-node-position';
import {
    moveNode,
    MoveNodeAction,
} from 'src/stores/view/reducers/document/structure/move-node/move-node';
import { ViewState } from 'src/stores/view/view-state-type';
import {
    mergeNode,
    MergeNodeAction,
} from 'src/stores/view/reducers/document/structure/merge-node/merge-node';
import { addSnapshot } from 'src/stores/view/reducers/history/add-snapshot';
import {
    selectSnapshot,
    SelectSnapshotAction,
} from 'src/stores/view/reducers/history/select-snapshot';
import {
    undoAction,
    UndoRedoAction,
} from 'src/stores/view/reducers/history/undo-action';
import {
    navigationEvents,
    structureAndContentEvents,
    UndoableAction,
} from 'src/stores/view/helpers/state-events';
import { redoAction } from 'src/stores/view/reducers/history/redo-action';
import { addNavigationHistoryItem } from 'src/stores/view/reducers/ui/helpers/add-navigation-history-item';
import {
    navigateActiveNode,
    NavigationAction,
} from 'src/stores/view/reducers/ui/navigate-active-node';

export type VerticalDirection = 'up' | 'down';
export type Direction = VerticalDirection | 'right';
export type AllDirections = Direction | 'left';

export type SavedDocument = {
    data: string;
    position: NodePosition | null;
    frontmatter: string;
};

type SetActiveNodeAction = {
    type: 'DOCUMENT/SET_ACTIVE_NODE';
    payload: {
        id: string;
    };
};
type ResetStoreAction = { type: 'RESET_STORE' };
type SetFilePathAction = {
    type: 'FS/SET_FILE_PATH';
    payload: {
        path: string | null;
    };
};
type ToggleHistorySidebarAction = {
    type: 'UI/TOGGLE_HISTORY_SIDEBAR';
};
type ToggleHelpSidebarAction = {
    type: 'UI/TOGGLE_HELP_SIDEBAR';
};
export type DocumentAction =
    | LoadDocumentAction
    | CreateNodeAction
    | ChangeActiveNodeAction
    | SetActiveNodeAction
    | ResetStoreAction
    | DisableEditModeAction
    | ToggleEditModeAction
    | SetNodeContentAction
    | SetDragStartedAction
    | SetDragCanceled
    | DropAction
    | SetFilePathAction
    | ToggleHistorySidebarAction
    | ToggleHelpSidebarAction
    | DeleteNodeAction
    | MoveNodeAction
    | MergeNodeAction;

export type HistoryAction = UndoRedoAction | SelectSnapshotAction;
export type ViewAction = DocumentAction | HistoryAction | NavigationAction;

const updateViewState = (state: ViewState, action: ViewAction) => {
    // state
    let saveSnapshot: boolean | undefined = false;
    if (action.type === 'DOCUMENT/SET_ACTIVE_NODE') {
        updateActiveNode(
            state.document.columns,
            state.document.state,
            action.payload.id,
        );
    } else if (action.type === 'DOCUMENT/NAVIGATE_USING_KEYBOARD') {
        navigateUsingKeyboard(
            state.document.columns,
            state.document.state,
            action,
        );
    } else if (action.type === 'SET_DRAG_STARTED') {
        onDragStart(state.document.columns, state.document.state.dnd, action);
    } else if (action.type === 'DOCUMENT/SET_DRAG_STARTED') {
        onDragEnd(state.document.state.dnd);
    } else if (action.type === 'DOCUMENT/ENABLE_EDIT_MODE') {
        enableEditMode(state.document.state);
    } else if (action.type === 'DOCUMENT/DISABLE_EDIT_MODE') {
        disableEditMode(state.document.state, action);
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
    } else if (action.type === 'DOCUMENT/DELETE_NODE') {
        saveSnapshot = deleteNode(
            state.document.columns,
            state.document.state,
            state.document.content,
            action,
        );
    } else if (action.type === 'DOCUMENT/DROP_NODE') {
        saveSnapshot = dropNode(
            state.document.columns,
            state.document.state,
            action,
        );
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
        saveSnapshot = loadDocumentFromFile(state, action);
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
    }

    if (saveSnapshot && structureAndContentEvents.has(action.type)) {
        addSnapshot(state.document, state.history, action as UndoableAction);
    }
    if (!navigationEvents.has(action.type)) {
        addNavigationHistoryItem(
            state.navigationHistory,
            state.document.content,
            state.document.state.activeBranch.node,
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
