import {
    CreateNodeAction,
    insertNode,
} from 'src/stores/document/reducers/node/insert-node/insert-node';
import { updateActiveNode } from 'src/stores/document/reducers/state/shared/update-active-node';
import {
    DropAction,
    dropNode,
} from 'src/stores/document/reducers/structure/drop-node/drop-node';
import {
    onDragEnd,
    SetDragCanceled,
} from 'src/stores/document/reducers/state/on-drag-end';
import {
    loadDocument,
    LoadDocumentAction,
} from 'src/stores/document/reducers/file/load-document/load-document';
import { resetDocument } from 'src/stores/document/reducers/reset-document';
import {
    setNodeContent,
    SetNodeContentAction,
} from 'src/stores/document/reducers/editing/set-node-content';
import {
    onDragStart,
    SetDragStartedAction,
} from 'src/stores/document/reducers/state/on-drag-start';
import {
    enableEditMode,
    ToggleEditModeAction,
} from 'src/stores/document/reducers/editing/enable-edit-mode';
import {
    disableEditMode,
    DisableEditModeAction,
} from 'src/stores/document/reducers/editing/disable-edit-mode';
import {
    ChangeActiveNodeAction,
    changeActiveNodeUsingKeyboard,
} from 'src/stores/document/reducers/state/change-active-node-using-keyboard';
import {
    deleteNode,
    DeleteNodeAction,
} from 'src/stores/document/reducers/structure/delete-node/delete-node';
import { NodePosition } from 'src/stores/document/helpers/search/find-node-position';
import {
    moveNode,
    MoveNodeAction,
} from 'src/stores/document/reducers/structure/move-node/move-node';
import { ViewState } from 'src/stores/document/document-type';
import {
    mergeNode,
    MergeNodeAction,
} from 'src/stores/document/reducers/structure/merge-node/merge-node';

export type VerticalDirection = 'up' | 'down';
export type Direction = VerticalDirection | 'right';
export type AllDirections = Direction | 'left';

export type SavedDocument = {
    data: string;
    position: NodePosition | null;
    frontmatter: string;
};

export type DocumentAction =
    | LoadDocumentAction
    | CreateNodeAction
    | ChangeActiveNodeAction
    | {
          type: 'SET_ACTIVE_NODE';
          payload: {
              id: string;
          };
      }
    | { type: 'RESET_STORE' }
    | DisableEditModeAction
    | ToggleEditModeAction
    | SetNodeContentAction
    | SetDragStartedAction
    | SetDragCanceled
    | DropAction
    | {
          type: 'FS/SET_FILE_PATH';
          payload: {
              path: string | null;
          };
      }
    | {
          type: 'UI/TOGGLE_HISTORY_SIDEBAR';
      }
    | {
          type: 'UI/TOGGLE_HELP_SIDEBAR';
      }
    | DeleteNodeAction
    | { type: 'EVENT/VIEW_LOADED' }
    | MoveNodeAction
    | MergeNodeAction;
const updateState = (state: ViewState, action: DocumentAction) => {
    // state
    if (action.type === 'SET_ACTIVE_NODE') {
        updateActiveNode(
            state.document.columns,
            state.document.state,
            action.payload.id,
        );
    } else if (action.type === 'CHANGE_ACTIVE_NODE_USING_KEYBOARD') {
        changeActiveNodeUsingKeyboard(
            state.document.columns,
            state.document.state,
            action,
        );
    } else if (action.type === 'SET_DRAG_STARTED') {
        onDragStart(state.document.columns, state.document.state.dnd, action);
    } else if (action.type === 'SET_DRAG_CANCELED') {
        onDragEnd(state.document.state.dnd);
    }
    // node
    else if (action.type === 'ENABLE_EDIT_MODE') {
        enableEditMode(state.document.state);
    } else if (action.type === 'SET_NODE_CONTENT') {
        setNodeContent(state.document.content, action);
    } else if (action.type === 'CREATE_NODE') {
        insertNode(
            state.document.columns,
            state.document.state,
            state.document.content,
            action,
        );
    } else if (action.type === 'DISABLE_EDIT_MODE') {
        disableEditMode(state.document.state, action);
    }
    // structure
    else if (action.type === 'TREE/DELETE_NODE') {
        deleteNode(
            state.document.columns,
            state.document.state,
            state.document.content,
            action,
        );
    } else if (action.type === 'DROP_NODE') {
        dropNode(state.document.columns, state.document.state, action);
    } else if (action.type === 'MOVE_NODE') {
        moveNode(state.document.columns, state.document.state, action);
    } else if (action.type === 'MERGE_NODE') {
        mergeNode(
            state.document.columns,
            state.document.content,
            state.document.state,
            action,
        );
    }
    // life cycle and other
    else if (
        action.type === 'FILE/LOAD_DOCUMENT' ||
        action.type === 'APPLY_SNAPSHOT'
    ) {
        loadDocument(state, action);
    } else if (action.type === 'RESET_STORE') {
        resetDocument(state);
    } else if (action.type === 'FS/SET_FILE_PATH') {
        state.file.path = action.payload.path;
    } else if (action.type === 'UI/TOGGLE_HISTORY_SIDEBAR') {
        state.ui.showHelpSidebar = false;
        state.ui.showHistorySidebar = !state.ui.showHistorySidebar;
    } else if (action.type === 'UI/TOGGLE_HELP_SIDEBAR') {
        state.ui.showHistorySidebar = false;
        state.ui.showHelpSidebar = !state.ui.showHelpSidebar;
    }
};

export const documentReducer = (
    store: ViewState,
    action: DocumentAction,
): ViewState => {
    updateState(store, action);
    return store;
};
