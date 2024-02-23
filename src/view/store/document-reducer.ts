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
import { findNode } from 'src/view/store/helpers/find-node';
import { findChildGroup } from 'src/view/store/helpers/find-branch';
import { findNodeColumn } from 'src/view/store/helpers/find-node-column';

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
    };
    refs: {
        container: HTMLElement | null;
    };
};

export type SiblingPosition = 'top' | 'bottom';
export type NodePosition = SiblingPosition | 'right';

export type SavedDocument = string;

export type DocumentAction =
    | LoadDocumentAction
    | CreateNodeAction
    | {
          type: 'CHANGE_ACTIVE_NODE';
          payload: {
              direction: NodePosition | 'left';
          };
      }
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
      };
const updateState = (state: DocumentState, action: DocumentAction) => {
    const columns = state.columns;
    // navigation
    if (action.type === 'SET_ACTIVE_NODE') {
        updateActiveNode(state, action.payload.id);
    } else if (action.type === 'CHANGE_ACTIVE_NODE') {
        const node = findNode(state.columns, state.state.activeBranch.node);
        if (!node) return;
        const columnIndex = findNodeColumn(state.columns, node.parentId);
        const column = columns[columnIndex];
        if (!column) return;
        let nextNode: ColumnNode | undefined = undefined;
        if (action.payload.direction === 'left') {
            nextNode = findNode(columns, node.parentId);
        } else if (action.payload.direction === 'right') {
            const group = findChildGroup(columns, node);
            if (group) {
                nextNode = group.nodes[0];
            } else {
                const nextColumn = columns[columnIndex + 1];
                if (!nextColumn) return;
                nextNode = nextColumn.groups[0]?.nodes?.[0];
            }
        } else {
            const allNodes = column.groups.map((g) => g.nodes).flat();
            const nodeIndex = allNodes.findIndex((n) => n.id === node.id);

            if (action.payload.direction === 'top') {
                if (nodeIndex > 0) {
                    nextNode = allNodes[nodeIndex - 1];
                }
            } else if (action.payload.direction === 'bottom') {
                if (nodeIndex < allNodes.length - 1) {
                    nextNode = allNodes[nodeIndex + 1];
                }
            }
        }
        if (nextNode) {
            updateActiveNode(state, nextNode.id);
        }
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
    // life cycle
    else if (action.type === 'LOAD_DATA') {
        loadDocument(state, action);
    } else if (action.type === 'CREATE_FIRST_NODE') {
        createFirstNode(state);
    } else if (action.type === 'RESET_STORE') {
        resetDocument(state);
    } else if (action.type === 'SET_CONTAINER') {
        state.refs.container = action.payload.ref;
    }
};

export const documentReducer = (
    store: DocumentState,
    action: DocumentAction,
): DocumentState => {
    updateState(store, action);
    return store;
};
