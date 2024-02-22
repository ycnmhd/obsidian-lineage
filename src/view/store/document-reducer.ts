import { createNode } from './helpers/create-node';
import { id } from 'src/helpers/id';
import { insertSiblingNode } from 'src/view/store/helpers/insert-sibling-node';
import { updateActiveNode } from 'src/view/store/helpers/update-active-node';
import { findNode } from 'src/view/store/helpers/find-node';
import { traverseDown } from 'src/view/store/helpers/find-branch';
import { moveNode } from 'src/view/store/helpers/move-node/move-node';
import { onDragEnd } from 'src/view/store/helpers/on-drag-end';
import { jsonTreeToColumns } from 'src/view/store/helpers/conversion/json-to-columns/json-tree-to-columns';
import { markdownToJson } from 'src/view/store/helpers/conversion/markdown-to-json/markdown-to-json';

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
            node: string;
        };
    };
};

export type SiblingPosition = 'top' | 'bottom';
export type NodePosition = SiblingPosition | 'right';

export type CreateNodeAction = {
    type: 'CREATE_NODE';
    payload: {
        parentId: string;
        nodeId: string;
        position: NodePosition;
        __newNodeID__?: string;
    };
};
export type SavedDocument = string;

export type DropAction = {
    type: 'DROP_NODE';
    payload: {
        droppedNodeId: string;
        targetNodeId: string;
        position: NodePosition;
    };
};
export type DocumentAction =
    | {
          type: 'LOAD_DATA';
          payload: {
              data: SavedDocument;
          };
      }
    | CreateNodeAction
    | {
          type: 'SET_ACTIVE';
          payload: {
              id: string;
          };
      }
    | {
          type: 'CREATE_FIRST_NODE';
      }
    | { type: 'RESET_STORE' }
    | {
          type: 'TOGGLE_EDIT_NODE';
          payload: {
              nodeId: string;
          };
      }
    | {
          type: 'SET_NODE_CONTENT';
          payload: {
              nodeId: string;
              content: string;
          };
      }
    | {
          type: 'SET_DRAG_STARTED';
          payload: {
              nodeId: string;
          };
      }
    | {
          type: 'SET_DRAG_CANCELED';
      }
    | DropAction;

const updateState = (store: DocumentState, action: DocumentAction) => {
    if (action.type === 'LOAD_DATA') {
        store.columns = jsonTreeToColumns(markdownToJson(action.payload.data));
        const firstNode = store.columns[0]?.groups?.[0]?.nodes?.[0];
        if (firstNode) updateActiveNode(store, firstNode.id);
    } else {
        const columns = store.columns;
        if (action.type === 'CREATE_FIRST_NODE') {
            if (columns.length === 0) {
                const rootId = id.rootNode();
                const createdNode = createNode(rootId);
                columns.push({
                    id: id.column(),
                    groups: [
                        {
                            parentId: rootId,
                            nodes: [createdNode],
                            id: id.group(),
                        },
                    ],
                });
                updateActiveNode(store, createdNode.id, true);
            }
        } else if (action.type === 'CREATE_NODE') {
            insertSiblingNode(store, action);
        } else if (action.type === 'SET_ACTIVE') {
            updateActiveNode(store, action.payload.id);
        } else if (action.type === 'RESET_STORE') {
            const newState = initialDocumentState();
            store.state = newState.state;
            store.columns = newState.columns;
        } else if (action.type === 'SET_NODE_CONTENT') {
            const node = findNode(columns, action.payload.nodeId);
            if (node) {
                node.content = action.payload.content;
            }
        } else if (action.type === 'TOGGLE_EDIT_NODE') {
            if (store.state.editing.node === action.payload.nodeId)
                store.state.editing.node = '';
            else store.state.editing.node = action.payload.nodeId;
        } else if (action.type === 'SET_DRAG_STARTED') {
            const node = findNode(columns, action.payload.nodeId);
            if (node) {
                const childGroups = new Set<string>();
                traverseDown(childGroups, new Set<string>(), columns, node);
                store.state.draggedBranch.node = action.payload.nodeId;
                store.state.draggedBranch.childGroups = childGroups;
            }
        } else if (action.type === 'SET_DRAG_CANCELED') {
            onDragEnd(store);
        } else if (action.type === 'DROP_NODE') {
            moveNode(columns, action);
            updateActiveNode(store, action.payload.droppedNodeId);
            onDragEnd(store);
        }
    }
};

export const documentReducer = (
    store: DocumentState,
    action: DocumentAction,
): DocumentState => {
    updateState(store, action);
    return store;
};

export const initialDocumentState = (): DocumentState => ({
    columns: [],
    state: {
        activeBranch: {
            node: '',
            childNodes: new Set<string>(),
            childGroups: new Set<string>(),
            parentNodes: new Set<string>(),
            siblingNodes: new Set<string>(),
        },
        draggedBranch: {
            node: '',
            childGroups: new Set<string>(),
        },
        editing: {
            node: '',
        },
    },
});
