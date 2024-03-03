import { ActiveBranch, Column, NodeId } from 'src/stores/view/view-state-type';
import { AllDirections } from 'src/stores/view/view-reducer';
import { findGroupByNodeId } from 'src/stores/view/helpers/search/find-group-by-node-id';
import { findAdjacentSiblingNode } from 'src/stores/view/reducers/document/structure/helpers/find-adjacent-sibling-node';
import { findNodeColumn } from 'src/stores/view/helpers/find-node-column';

export const findAdjacentNode = (
    columns: Column[],
    state: ActiveBranch,
    direction: AllDirections,
) => {
    let targetNode: NodeId | null = null;
    const nodeToMove = state.node;
    if (direction === 'left') {
        const group = findGroupByNodeId(columns, nodeToMove);
        if (group && !group.parentId.startsWith('r'))
            targetNode = group.parentId;
    } else {
        targetNode = findAdjacentSiblingNode(
            columns,
            nodeToMove,
            direction === 'right' ? 'up' : direction,
        );
    }

    // if first node of column is trying to move right, move it under the node below
    if (!targetNode && direction === 'right') {
        const columnIndex = findNodeColumn(columns, nodeToMove);
        const isFirstNodeOfColumn =
            columns[columnIndex].groups[0]?.nodes[0] === nodeToMove;
        if (isFirstNodeOfColumn) {
            targetNode = findAdjacentSiblingNode(columns, nodeToMove, 'down');
        }
    }
    return targetNode;
};
