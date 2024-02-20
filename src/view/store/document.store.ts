import { Store } from 'src/helpers/store';
import { createNode } from './helpers/create-node';
import { id } from 'src/helpers/id';
import { insertSiblingNode } from 'src/view/store/helpers/insert-sibling-node';
import { updateActiveNode } from 'src/view/store/helpers/update-active-node';
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
type Action =
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
            updateActiveNode(store, createdNode.id, true);
        }
    } else if (action.type === 'CREATE_NODE') {
        insertSiblingNode(store, action);
    } else if (action.type === 'SET_ACTIVE') {
        updateActiveNode(store, action.payload.id);
    } else if (action.type === 'RESET_STORE') {
        const newState = initialState();
        store.state = newState.state;
        store.matrix = newState.matrix;
    } else if (action.type === 'SET_NODE_CONTENT') {
        const node = findNode(store.matrix, action.payload.nodeId);
        if (node) {
            node.content = action.payload.content;
        }
    } else if (action.type === 'TOGGLE_EDIT_NODE') {
        if (store.state.editing.node === action.payload.nodeId)
            store.state.editing.node = '';
        else store.state.editing.node = action.payload.nodeId;
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
        editing: {
            node: '',
        },
    },
});
export const documentStore = new Store<State, Action>(initialState(), reducer);
