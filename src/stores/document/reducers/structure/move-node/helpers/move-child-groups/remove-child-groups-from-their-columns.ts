import { Columns, NodeGroup, NodeId } from 'src/stores/document/document-type';
import { traverseDown } from 'src/stores/document/helpers/search/traverse-down';

export const removeChildGroupsFromTheirColumns = (
    columns: Columns,
    currentParentNode: NodeId,
) => {
    const childGroupsArray: NodeId[] = [];
    traverseDown(
        childGroupsArray,
        new Set<string>(),
        columns,
        currentParentNode,
    );
    const childGroups = new Set(childGroupsArray);
    // each column contains one and only one child group of a node
    const sortedChildGroups: NodeGroup[] = [];
    // remove child groups from their current columns
    for (const column of columns) {
        const groups = [];
        for (const group of column.groups) {
            if (childGroups.has(group.parentId)) {
                sortedChildGroups.push(group);
            } else {
                groups.push(group);
            }
        }

        column.groups = groups;
    }
    return sortedChildGroups;
};
