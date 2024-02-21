import { findNode } from 'src/view/store/helpers/find-node';
import { findGroup } from 'src/view/store/helpers/find-branch';
import { DropAction, Matrix } from 'src/view/store/document-reducer';
import { moveNodeAsSibling } from 'src/view/store/helpers/move-node/helpers/move-node-as-sibling';

import { moveNodeAsChild } from 'src/view/store/helpers/move-node/helpers/move-node-as-child';
import { moveChildGroups } from 'src/view/store/helpers/move-node/helpers/move-child-groups';

export const moveNode = (matrix: Matrix, action: DropAction) => {
    const droppedNode = findNode(matrix, action.payload.droppedNodeId);
    const targetNode = findNode(matrix, action.payload.targetNodeId);
    if (droppedNode && targetNode) {
        const currentParentIdOfDroppedNode = droppedNode.parentId;
        const currentGroup = findGroup(matrix, droppedNode);
        if (currentGroup) {
            currentGroup.nodes = currentGroup.nodes.filter(
                (n) => n.id !== droppedNode.id,
            );

            if (action.payload.position === 'right') {
                moveNodeAsChild(matrix, action, droppedNode, targetNode);
            } else {
                moveNodeAsSibling(matrix, action, droppedNode, targetNode);
            }

            if (currentParentIdOfDroppedNode !== droppedNode.parentId) {
                moveChildGroups(matrix, droppedNode);
            }
        }
    }
};
