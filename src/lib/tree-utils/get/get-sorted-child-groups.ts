import {
    Columns,
    NodeGroup,
    NodeId,
} from 'src/stores/document/document-state-type';
import { traverseDown } from 'src/lib/tree-utils/get/traverse-down';

export const getSortedChildGroups = (
    columns: Columns,
    currentParentNode: NodeId,
    remove = false,
) => {
    const childGroupsArray: NodeId[] = [];
    traverseDown(childGroupsArray, columns, currentParentNode);
    const childGroups = new Set(childGroupsArray);
    const sortedChildGroups: NodeGroup[][] = [];

    for (const column of columns) {
        const childGroupsOfColumns: NodeGroup[] = [];
        const groups = [];
        for (const group of column.groups) {
            if (childGroups.has(group.parentId)) {
                childGroupsOfColumns.push(group);
            } else {
                groups.push(group);
            }
        }
        if (remove) column.groups = groups;
        if (childGroupsOfColumns.length > 0)
            sortedChildGroups.push(childGroupsOfColumns);
    }
    return sortedChildGroups;
};
