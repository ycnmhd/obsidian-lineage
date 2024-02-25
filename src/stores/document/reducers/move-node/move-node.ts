import { findNode } from 'src/stores/document/helpers/find-node';
import { findGroup } from 'src/stores/document/helpers/find-branch';
import { Columns, NodeDirection } from 'src/stores/document/document-reducer';
import { moveNodeAsSibling } from 'src/stores/document/reducers/move-node/helpers/move-node-as-sibling';

import { moveNodeAsChild } from 'src/stores/document/reducers/move-node/helpers/move-node-as-child';
import { moveChildGroups } from 'src/stores/document/reducers/move-node/helpers/move-child-groups';

export type DropAction = {
    type: 'DROP_NODE';
    payload: {
        droppedNodeId: string;
        targetNodeId: string;
        position: NodeDirection;
    };
};
export const moveNode = (columns: Columns, action: DropAction) => {
    const droppedNode = findNode(columns, action.payload.droppedNodeId);
    const targetNode = findNode(columns, action.payload.targetNodeId);
    if (droppedNode && targetNode) {
        const currentParentIdOfDroppedNode = droppedNode.parentId;
        const currentGroup = findGroup(columns, droppedNode);
        if (currentGroup) {
            currentGroup.nodes = currentGroup.nodes.filter(
                (n) => n.id !== droppedNode.id,
            );

            if (action.payload.position === 'right') {
                moveNodeAsChild(columns, action, droppedNode, targetNode);
            } else {
                moveNodeAsSibling(columns, action, droppedNode, targetNode);
            }

            if (currentParentIdOfDroppedNode !== droppedNode.parentId) {
                moveChildGroups(columns, droppedNode);
            }
        }
    }
};
