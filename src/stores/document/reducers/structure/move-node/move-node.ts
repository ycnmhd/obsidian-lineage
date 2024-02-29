import { findNode } from 'src/stores/document/helpers/find-node';
import { findGroup } from 'src/stores/document/helpers/find-branch';
import {
    DocumentState,
    NodeDirection,
} from 'src/stores/document/document-reducer';
import { moveNodeAsSibling } from 'src/stores/document/reducers/structure/move-node/helpers/move-node-as-sibling';

import { moveNodeAsChild } from 'src/stores/document/reducers/structure/move-node/helpers/move-node-as-child';
import { moveChildGroups } from 'src/stores/document/reducers/structure/move-node/helpers/move-child-groups';
import { cleanAndSortColumns } from 'src/stores/document/reducers/state/helpers/clean-and-sort-columns';

export type DropAction = {
    type: 'DROP_NODE';
    payload: {
        droppedNodeId: string;
        targetNodeId: string;
        position: NodeDirection;
    };
};
export const moveNode = (
    state: Pick<DocumentState, 'columns'>,
    action: DropAction,
) => {
    const columns = state.columns;
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
                moveNodeAsChild(columns, droppedNode, targetNode);
            } else {
                moveNodeAsSibling(columns, action, droppedNode, targetNode);
            }

            if (currentParentIdOfDroppedNode !== droppedNode.parentId) {
                moveChildGroups(columns, droppedNode);
            }
        }
    }

    cleanAndSortColumns(state);
};
