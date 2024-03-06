import { Columns, NodeGroup, NodeId } from 'src/stores/view/view-state-type';
import { traverseDown } from 'src/stores/view/helpers/search/traverse-down';

export const removeChildGroupsFromTheirColumns = (
    columns: Columns,
    currentParentNode: NodeId,
) => {
    const childGroupsArray: NodeId[] = [];
    traverseDown(childGroupsArray, columns, currentParentNode);
    const childGroups = new Set(childGroupsArray);
    const sortedChildGroups: NodeGroup[][] = [];
    // remove child groups from their current columns
    for (const column of columns) {
        const removedGroups: NodeGroup[] = [];
        const groups = [];
        for (const group of column.groups) {
            if (childGroups.has(group.parentId)) {
                removedGroups.push(group);
            } else {
                groups.push(group);
            }
        }

        column.groups = groups;
        if (removedGroups.length > 0) sortedChildGroups.push(removedGroups);
    }
    return sortedChildGroups;
};
