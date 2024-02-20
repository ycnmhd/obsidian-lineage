import { Store } from 'src/helpers/store';
import { insertChild } from './helpers/insert-child';
import { findNodeColumn } from './helpers/find-node-column';
import { createNode } from './helpers/create-node';
import {
    findSiblings,
    traverseDown,
    traverseUp,
} from 'src/view/store/helpers/find-branch';
import { id } from 'src/helpers/id';
import { findNode } from 'src/view/store/helpers/find-node';

export type MatrixNode = {
    id: string;
    content: string;
    parentId: string;
};
export type NodeGroup = {
    id: string;
    parentId: string;
    nodes: MatrixNode[];
};
export type Column = {
    id: string;
    groups: NodeGroup[];
};
export type Matrix = Column[];
export type State = {
    matrix: Column[];
    state: {
        activeBranch: {
            parentNodes: Set<string>;
            childNodes: Set<string>;
            childGroups: Set<string>;
            siblingNodes: Set<string>;
            node: string;
        };
    };
};

export type SiblingPosition = 'top' | 'bottom';
export type NodePosition = SiblingPosition | 'right';

type Action =
    | {
          type: 'CREATE_NODE';
          payload: {
              parentId: string;
              nodeId: string;
              position: NodePosition;
              __newNodeID__?: string;
          };
      }
    | {
          type: 'SET_ACTIVE';
          payload: {
              id: string;
          };
      }
    | {
          type: 'CREATE_FIRST_NODE';
      }
    | { type: 'RESET_STORE' };

const updateActiveNode = (store: State, nodeId: string) => {
    store.state.activeBranch.node = nodeId;
    const node = findNode(store.matrix, nodeId);
    if (node) {
        const parentIDs = new Set<string>();
        traverseUp(parentIDs, store.matrix, node);
        const childGroups = new Set<string>();
        const childNodes = new Set<string>();
        traverseDown(childGroups, childNodes, store.matrix, node);
        const siblingNodes = new Set<string>();
        findSiblings(siblingNodes, store.matrix, node);
        store.state.activeBranch.parentNodes = parentIDs;
        store.state.activeBranch.childGroups = childGroups;
        store.state.activeBranch.childNodes = childNodes;
        store.state.activeBranch.siblingNodes = siblingNodes;
    }
};

const updateState = (store: State, action: Action) => {
    if (action.type === 'CREATE_FIRST_NODE') {
        if (store.matrix.length === 0) {
            const rootId = id.rootNode();
            const createdNode = createNode(rootId);
            store.matrix.push({
                id: id.column(),
                groups: [
                    {
                        parentId: rootId,
                        nodes: [createdNode],
                        id: id.group(),
                    },
                ],
            });
            updateActiveNode(store, createdNode.id);
        }
    } else if (action.type === 'CREATE_NODE') {
        const payload = action.payload;
        if (payload.position === 'right') {
            const createdNodeId = insertChild(
                store.matrix,
                action.payload.nodeId,
                action.payload.parentId,
                action.payload.__newNodeID__,
            );
            if (createdNodeId) updateActiveNode(store, createdNodeId);
        } else {
            const columnIndex = findNodeColumn(
                store.matrix,
                action.payload.parentId,
            );
            const column = store.matrix[columnIndex];
            const group = column.groups.find(
                (g) => g.parentId === action.payload.parentId,
            );
            if (group) {
                const index = group.nodes.findIndex(
                    (c) => c.id === action.payload.nodeId,
                );
                if (columnIndex !== -1 && index !== -1) {
                    const insertionIndex =
                        action.payload.position === 'top' ? index : index + 1;
                    const createdNode = createNode(
                        action.payload.parentId,
                        action.payload.__newNodeID__,
                    );
                    group.nodes.splice(insertionIndex, 0, createdNode);
                    updateActiveNode(store, createdNode.id);
                }
            }
        }
    } else if (action.type === 'SET_ACTIVE') {
        updateActiveNode(store, action.payload.id);
    } else if (action.type === 'RESET_STORE') {
        const newState = initialState();
        store.state = newState.state;
        store.matrix = newState.matrix;
    }
};
export const reducer = (store: State, action: Action): State => {
    updateState(store, action);
    return store;
};

const initialState = (): State => ({
    matrix: [],
    state: {
        activeBranch: {
            node: '',
            childNodes: new Set<string>(),
            childGroups: new Set<string>(),
            parentNodes: new Set<string>(),
            siblingNodes: new Set<string>(),
        },
    },
});
export const documentStore = new Store<State, Action>(initialState(), reducer);
