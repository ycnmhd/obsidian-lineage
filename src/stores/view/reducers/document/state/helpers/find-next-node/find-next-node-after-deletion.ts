import { Column, NodeId } from 'src/stores/view/view-state-type';
import { findGroupByNodeId } from 'src/stores/view/helpers/search/find-group-by-node-id';
import { findNodeColumn } from 'src/stores/view/helpers/find-node-column';

export const findNextNodeAfterDeletion = (columns: Column[], node: string) => {
    let nextNode: NodeId | null = null;
    const group = findGroupByNodeId(columns, node);
    const columnIndex = findNodeColumn(columns, node);
    const column = columns[columnIndex];

    if (group) {
        const nodeIndex = group.nodes.findIndex((n) => n === node);
        if (nodeIndex === 0) nextNode = group.nodes[1];
        else if (nodeIndex > 0) nextNode = group.nodes[nodeIndex - 1];
        else nextNode = group.nodes[group.nodes.length - 1];

        /* if (!nextNode) {
		const groupIndex = column.groups.indexOf(group);
		const groupAbove = column.groups[groupIndex - 1].nodes;
		nextNode = groupAbove[groupAbove.length - 1];
	}*/
    }
    if (!nextNode) {
        if (group && columnIndex > 0) nextNode = group?.parentId;
        else nextNode = column.groups[0].nodes[0];
    }
    return nextNode;
};
