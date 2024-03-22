import { AllDirections } from 'src/stores/document/document-store-actions';
import { moveNodeAsChild } from 'src/stores/document/reducers/move-node/helpers/move-node-as-child';
import { moveNodeAsSibling } from 'src/stores/document/reducers/move-node/helpers/move-node-as-sibling';
import { moveChildGroupsNextToTheirParent } from 'src/stores/document/reducers/move-node/helpers/move-child-groups/move-child-groups-next-to-their-parent';
import { Column, NodeId } from 'src/stores/document/document-state-type';
import { removeNodeFromGroup } from 'src/stores/document/reducers/move-node/helpers/remove-node-from-group';

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
    moveChildGroupsNextToTheirParent(columns, node);
};
