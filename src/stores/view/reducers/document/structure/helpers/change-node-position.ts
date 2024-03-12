import { AllDirections } from 'src/stores/view/view-store-actions';
import { moveNodeAsChild } from 'src/stores/view/reducers/document/structure/helpers/move-node-as-child';
import { moveNodeAsSibling } from 'src/stores/view/reducers/document/structure/helpers/move-node-as-sibling';
import { moveChildGroups } from 'src/stores/view/reducers/document/structure/helpers/move-child-groups/move-child-groups';
import { Column, NodeId } from 'src/stores/view/view-state-type';
import { removeNodeFromGroup } from 'src/stores/view/reducers/document/structure/helpers/remove-node-from-group';

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
