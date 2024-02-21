import { Matrix, MatrixNode, NodeGroup } from 'src/view/store/document-reducer';
import { traverseDown } from 'src/view/store/helpers/find-branch';
import { findNodeColumn } from 'src/view/store/helpers/find-node-column';
import { id } from 'src/helpers/id';
import { sortGroups } from 'src/view/store/helpers/sort-groups';

export const moveChildGroups = (matrix: Matrix, droppedNode: MatrixNode) => {
    // find children
    const childGroups = new Set<string>();
    traverseDown(childGroups, new Set<string>(), matrix, droppedNode);
    const sortedChildGroups: NodeGroup[] = [];
    // remove child groups from their current columns
    for (const column of matrix) {
        const groups = [];
        for (const group of column.groups) {
            if (childGroups.has(group.id)) {
                sortedChildGroups.push(group);
            } else {
                groups.push(group);
            }
        }
        column.groups = groups;
    }

    // insert child groups into their new columns
    const parentColumnIndex = findNodeColumn(matrix, droppedNode.parentId);
    for (let i = 0; i < sortedChildGroups.length; i++) {
        const group = sortedChildGroups[i];
        const targetColumnIndex = parentColumnIndex + 1 + i;
        if (!matrix[targetColumnIndex]) {
            matrix.push({
                id: id.column(),
                groups: [],
            });
        }
        matrix[targetColumnIndex].groups.push(group);
        matrix[targetColumnIndex].groups = sortGroups(
            matrix[targetColumnIndex - 1].groups,
            matrix[targetColumnIndex].groups,
        );
    }
};
