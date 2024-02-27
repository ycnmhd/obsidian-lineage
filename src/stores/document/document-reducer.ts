import {
    CreateNodeAction,
    insertNode,
} from 'src/stores/document/reducers/insert-node';
import { updateActiveNode } from 'src/stores/document/helpers/update-active-node';
import {
    DropAction,
    moveNode,
} from 'src/stores/document/reducers/move-node/move-node';
import { onDragEnd } from 'src/stores/document/reducers/on-drag-end';
import {
    loadDocument,
    LoadDocumentAction,
} from 'src/stores/document/reducers/load-document';
import { resetDocument } from 'src/stores/document/reducers/reset-document';
import {
    setNodeContent,
    SetNodeContentAction,
} from 'src/stores/document/reducers/editing/set-node-content';
import {
    onDragStart,
    SetDragStartedAction,
} from 'src/stores/document/reducers/on-drag-start';
import {
    enableEditMode,
    ToggleEditModeAction,
} from 'src/stores/document/reducers/editing/enable-edit-mode';
import {
    disableEditMode,
    DisableEditModeAction,
} from 'src/stores/document/reducers/editing/disable-edit-mode';
import { NodePosition } from 'src/stores/document/helpers/find-branch';
import {
    changeActiveNode,
    ChangeActiveNodeAction,
} from 'src/stores/document/reducers/change-active-node';
import {
    deleteNode,
    DeleteNodeAction,
} from 'src/stores/document/reducers/creation/delete-node';

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
            sortedParentNodes: ColumnNode[];
            group: string;
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
            showHelpSidebar: boolean;
        };
    };

    file: {
        path: string | null;
        frontmatter: string;
    };
};

export type SiblingPosition = 'top' | 'bottom';
export type NodeDirection = SiblingPosition | 'right';

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
    | {
          type: 'SET_DRAG_CANCELED';
      }
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
    | { type: 'EVENT/VIEW_LOADED' };
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
        state.state.ui.showHelpSidebar = false;
        state.state.ui.showHistorySidebar = !state.state.ui.showHistorySidebar;
    } else if (action.type === 'UI/TOGGLE_HELP_SIDEBAR') {
        state.state.ui.showHistorySidebar = false;
        state.state.ui.showHelpSidebar = !state.state.ui.showHelpSidebar;
    }
};

export const documentReducer = (
    store: DocumentState,
    action: DocumentAction,
): DocumentState => {
    updateState(store, action);
    return store;
};
