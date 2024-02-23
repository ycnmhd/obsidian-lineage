import { findNode } from 'src/view/store/helpers/find-node';
import { findGroup } from 'src/view/store/helpers/find-branch';
import { Columns, NodePosition } from 'src/view/store/document-reducer';
import { moveNodeAsSibling } from 'src/view/store/reducers/move-node/helpers/move-node-as-sibling';

import { moveNodeAsChild } from 'src/view/store/reducers/move-node/helpers/move-node-as-child';
import { moveChildGroups } from 'src/view/store/reducers/move-node/helpers/move-child-groups';

export type DropAction = {
    type: 'DROP_NODE';
    payload: {
        droppedNodeId: string;
        targetNodeId: string;
        position: NodePosition;
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
