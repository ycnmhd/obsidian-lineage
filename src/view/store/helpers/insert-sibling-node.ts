import { insertChild } from 'src/view/store/helpers/insert-child';
import { findNodeColumn } from 'src/view/store/helpers/find-node-column';
import { createNode } from 'src/view/store/helpers/create-node';
import { CreateNodeAction, State } from 'src/view/store/document.store';
import { updateActiveNode } from 'src/view/store/helpers/update-active-node';

export const insertSiblingNode = (store: State, action: CreateNodeAction) => {
    const payload = action.payload;
    if (payload.position === 'right') {
        const createdNodeId = insertChild(
            store.matrix,
            action.payload.nodeId,
            action.payload.parentId,
            action.payload.__newNodeID__,
        );
        if (createdNodeId) {
            updateActiveNode(store, createdNodeId, true);
            store.state.editing.node = createdNodeId;
        }
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
                updateActiveNode(store, createdNode.id, true);
            }
        }
    }
};
