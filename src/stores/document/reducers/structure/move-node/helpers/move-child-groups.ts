import { traverseDown } from 'src/stores/document/helpers/search/traverse-down';
import { findNodeColumn } from 'src/stores/document/helpers/find-node-column';
import { id } from 'src/helpers/id';
import {
    ColumnNode,
    Columns,
    NodeGroup,
} from 'src/stores/document/document-type';

export const moveChildGroups = (columns: Columns, droppedNode: ColumnNode) => {
    // find children
    const childGroups = new Set<string>();
    traverseDown(childGroups, new Set<string>(), columns, droppedNode);
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

    // insert child groups into their new columns
    const parentColumnIndex = findNodeColumn(columns, droppedNode);
    for (let i = 0; i < sortedChildGroups.length; i++) {
        const group = sortedChildGroups[i];
        const targetColumnIndex = parentColumnIndex + 1 + i;
        if (!columns[targetColumnIndex]) {
            columns.push({
                id: id.column(),
                groups: [],
            });
        }
        columns[targetColumnIndex].groups.push(group);
    }
};
