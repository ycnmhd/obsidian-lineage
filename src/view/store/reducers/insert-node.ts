import { insertChild } from 'src/view/store/helpers/insert-child';
import { findNodeColumn } from 'src/view/store/helpers/find-node-column';
import { createNode } from 'src/view/store/helpers/create-node';
import { DocumentState, NodeDirection } from 'src/view/store/document-reducer';
import { updateActiveNode } from 'src/view/store/helpers/update-active-node';
import { findNode } from 'src/view/store/helpers/find-node';

export type CreateNodeAction = {
    type: 'CREATE_NODE';
    payload: {
        position: NodeDirection;
        __newNodeID__?: string;
    };
};
export const insertNode = (state: DocumentState, action: CreateNodeAction) => {
    const payload = action.payload;
    const node = findNode(state.columns, state.state.activeBranch.node);
    if (!node) return;
    const { id: nodeId, parentId } = node;
    if (payload.position === 'right') {
        const createdNodeId = insertChild(
            state.columns,
            nodeId,
            parentId,
            action.payload.__newNodeID__,
        );
        if (createdNodeId) {
            updateActiveNode(state, createdNodeId, true);
        }
    } else {
        const columnIndex = findNodeColumn(state.columns, parentId);
        const column = state.columns[columnIndex];
        const group = column.groups.find((g) => g.parentId === parentId);
        if (group) {
            const index = group.nodes.findIndex((c) => c.id === nodeId);
            if (columnIndex !== -1 && index !== -1) {
                const insertionIndex =
                    action.payload.position === 'top' ? index : index + 1;
                const createdNode = createNode(
                    parentId,
                    action.payload.__newNodeID__,
                );
                group.nodes.splice(insertionIndex, 0, createdNode);
                updateActiveNode(state, createdNode.id, true);
            }
        }
    }
};
