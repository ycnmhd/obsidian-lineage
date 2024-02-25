import {
    CreateNodeAction,
    insertNode,
} from 'src/view/store/reducers/insert-node';
import { updateActiveNode } from 'src/view/store/helpers/update-active-node';
import {
    DropAction,
    moveNode,
} from 'src/view/store/reducers/move-node/move-node';
import { onDragEnd } from 'src/view/store/reducers/on-drag-end';
import { createFirstNode } from 'src/view/store/reducers/create-first-node';
import {
    loadDocument,
    LoadDocumentAction,
} from 'src/view/store/reducers/load-document';
import { resetDocument } from 'src/view/store/reducers/reset-document';
import {
    setNodeContent,
    SetNodeContentAction,
} from 'src/view/store/reducers/editing/set-node-content';
import {
    onDragStart,
    SetDragStartedAction,
} from 'src/view/store/reducers/on-drag-start';
import {
    enableEditMode,
    ToggleEditModeAction,
} from 'src/view/store/reducers/editing/enable-edit-mode';
import {
    disableEditMode,
    DisableEditModeAction,
} from 'src/view/store/reducers/editing/disable-edit-mode';
import { NodePosition } from 'src/view/store/helpers/find-branch';
import {
    changeActiveNode,
    ChangeActiveNodeAction,
} from 'src/view/store/reducers/change-active-node';
import {
    deleteNode,
    DeleteNodeAction,
} from 'src/view/store/reducers/creation/delete-node';

export type ColumnNode = {
    id: string;
    content: string;
    parentId: string;
};
export type NodeGroup = {
    id: string;
    parentId: string;
    nodes: ColumnNode[];
};
export type Column = {
    id: string;
    groups: NodeGroup[];
};
export type Columns = Column[];
export type DocumentState = {
    columns: Column[];
    state: {
        activeBranch: {
            parentNodes: Set<string>;
            childNodes: Set<string>;
            childGroups: Set<string>;
            siblingNodes: Set<string>;
            node: string;
        };
        draggedBranch: {
            childGroups: Set<string>;
            node: string;
        };
        editing: {
            activeNodeId: string;
            savePreviousNode: boolean;
        };
        ui: {
            showHistorySidebar: boolean;
        };
    };
    refs: {
        container: HTMLElement | null;
    };
    file: {
        path: string | null;
    };
};

export type SiblingPosition = 'top' | 'bottom';
export type NodeDirection = SiblingPosition | 'right';

export type SavedDocument = {
    data: string;
    position: NodePosition | null;
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
    | {
          type: 'CREATE_FIRST_NODE';
      }
    | { type: 'RESET_STORE' }
    | DisableEditModeAction
    | ToggleEditModeAction
    | SetNodeContentAction
    | SetDragStartedAction
    | {
          type: 'SET_DRAG_CANCELED';
      }
    | DropAction
    | {
          type: 'SET_CONTAINER';
          payload: { ref: HTMLElement | null };
      }
    | {
          type: 'FS/SET_FILE_PATH';
          payload: {
              path: string | null;
          };
      }
    | {
          type: 'UI/TOGGLE_HISTORY_SIDEBAR';
      }
    | DeleteNodeAction;
const updateState = (state: DocumentState, action: DocumentAction) => {
    const columns = state.columns;
    // navigation
    if (action.type === 'SET_ACTIVE_NODE') {
        updateActiveNode(state, action.payload.id);
    } else if (action.type === 'CHANGE_ACTIVE_NODE') {
        changeActiveNode(state, action);
    }
    // editing actions
    else if (action.type === 'ENABLE_EDIT_MODE') {
        enableEditMode(state);
    } else if (action.type === 'SET_NODE_CONTENT') {
        setNodeContent(state, action);
    } else if (action.type === 'CREATE_NODE') {
        insertNode(state, action);
    } else if (action.type === 'DISABLE_EDIT_MODE') {
        disableEditMode(state, action);
    } else if (action.type === 'TREE/DELETE_NODE') {
        deleteNode(state);
    }
    // dnd
    else if (action.type === 'SET_DRAG_STARTED') {
        onDragStart(state, action);
    } else if (action.type === 'SET_DRAG_CANCELED') {
        onDragEnd(state);
    } else if (action.type === 'DROP_NODE') {
        moveNode(columns, action);
        updateActiveNode(state, action.payload.droppedNodeId);
        onDragEnd(state);
    }
    // life cycle and other
    else if (action.type === 'LOAD_DATA' || action.type === 'APPLY_SNAPSHOT') {
        loadDocument(state, action);
    } else if (action.type === 'CREATE_FIRST_NODE') {
        createFirstNode(state);
    } else if (action.type === 'RESET_STORE') {
        resetDocument(state);
    } else if (action.type === 'SET_CONTAINER') {
        state.refs.container = action.payload.ref;
    } else if (action.type === 'FS/SET_FILE_PATH') {
        state.file.path = action.payload.path;
    } else if (action.type === 'UI/TOGGLE_HISTORY_SIDEBAR') {
        state.state.ui.showHistorySidebar = !state.state.ui.showHistorySidebar;
    }
};

export const documentReducer = (
    store: DocumentState,
    action: DocumentAction,
): DocumentState => {
    updateState(store, action);
    return store;
};
