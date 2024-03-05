import { Column, NodeId } from 'src/stores/view/view-state-type';
import { AllDirections } from 'src/stores/view/view-reducer';
import { findNodeColumn } from 'src/stores/view/helpers/find-node-column';
import { findGroupByNodeId } from 'src/stores/view/helpers/search/find-group-by-node-id';
import { findChildGroup } from 'src/stores/view/helpers/search/find-child-group';

export const findNextActiveNodeOnKeyboardNavigation = (
    columns: Column[],
    node: string,
    direction: AllDirections,
) => {
    if (!node) return;
    let nextNode: NodeId | null = null;
    const columnIndex = findNodeColumn(columns, node);
    const column = columns[columnIndex];
    if (!column) return;
    if (direction === 'left') {
        const group = findGroupByNodeId(columns, node);
        if (group && !group.parentId.startsWith('r')) nextNode = group.parentId;
    } else if (direction === 'right') {
        const group = findChildGroup(columns, node);
        if (group) {
            nextNode = group.nodes[0];
        }
        // commenting this because a childless node should not be able to navigate right
        /*else {
			const nextColumn = columns[columnIndex + 1];
			if (!nextColumn) return;
			nextNode = nextColumn.groups[0]?.nodes?.[0];
		}*/
    } else {
        const allNodes = column.groups.map((g) => g.nodes).flat();
        const nodeIndex = allNodes.findIndex((n) => n === node);

        if (direction === 'up') {
            if (nodeIndex > 0) {
                nextNode = allNodes[nodeIndex - 1];
            }
        } else if (direction === 'down') {
            if (nodeIndex < allNodes.length - 1) {
                nextNode = allNodes[nodeIndex + 1];
            }
        }
    }
    return nextNode;
};
