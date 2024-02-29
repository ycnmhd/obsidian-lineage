import { insertChild } from 'src/stores/document/reducers/node/insert-node/helpers/insert-child';
import { findNodeColumn } from 'src/stores/document/helpers/find-node-column';
import { createNode } from 'src/stores/document/helpers/create-node';
import {
    ColumnNode,
    DocumentState,
    NodeDirection,
} from 'src/stores/document/document-reducer';
import { findNode } from 'src/stores/document/helpers/find-node';
import { updateActiveNode } from 'src/stores/document/reducers/state/update-active-node';

export type CreateNodeAction = {
    type: 'CREATE_NODE';
    payload: {
        position: NodeDirection;
        content?: string;
        __newNodeID__?: string;
    };
};
export const insertNode = (state: DocumentState, action: CreateNodeAction) => {
    const payload = action.payload;
    const node = findNode(state.columns, state.state.activeBranch.node);
    if (!node) return;
    const { id: nodeId, parentId } = node;
    let createdNode: ColumnNode | null = null;
    if (payload.position === 'right') {
        createdNode = insertChild(
            state.columns,
            nodeId,
            parentId,
            action.payload.content,
            action.payload.__newNodeID__,
        );
    } else {
        const columnIndex = findNodeColumn(state.columns, parentId);
        const column = state.columns[columnIndex];
        const group = column.groups.find((g) => g.parentId === parentId);
        if (group) {
            const index = group.nodes.findIndex((c) => c.id === nodeId);
            if (columnIndex !== -1 && index !== -1) {
                const insertionIndex =
                    action.payload.position === 'top' ? index : index + 1;
                createdNode = createNode(
                    parentId,
                    action.payload.__newNodeID__,
                    action.payload.content,
                );
                group.nodes.splice(insertionIndex, 0, createdNode);
                createdNode.id;
            }
        }
    }
    if (createdNode) {
        updateActiveNode(state, createdNode.id, true);
    }
};
