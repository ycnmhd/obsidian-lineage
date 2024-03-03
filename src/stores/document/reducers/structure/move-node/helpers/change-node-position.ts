import { AllDirections } from 'src/stores/document/document-reducer';
import { moveNodeAsChild } from 'src/stores/document/reducers/structure/move-node/helpers/move-node-as-child';
import { moveNodeAsSibling } from 'src/stores/document/reducers/structure/move-node/helpers/move-node-as-sibling';
import { moveChildGroups } from 'src/stores/document/reducers/structure/move-node/helpers/move-child-groups/move-child-groups';
import { Column, NodeId } from 'src/stores/document/document-type';
import { removeNodeFromGroup } from 'src/stores/document/reducers/structure/move-node/helpers/remove-node-from-group';

export const changeNodePosition = (
    columns: Column[],
    node: NodeId,
    targetNode: NodeId,
    direction: AllDirections,
) => {
    removeNodeFromGroup(columns, node);
    if (direction === 'right') {
        moveNodeAsChild(columns, node, targetNode);
    } else {
        moveNodeAsSibling(
            columns,
            direction === 'left' ? 'down' : direction,
            node,
            targetNode,
        );
    }
    moveChildGroups(columns, {
        type: 'MOVE_PARENT',
        payload: { currentParent: node },
    });
};
