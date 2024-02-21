import {
    Column,
    DropAction,
    Matrix,
    MatrixNode,
} from 'src/view/store/document-reducer';
import { findChildGroup, findGroup } from 'src/view/store/helpers/find-branch';
import { findNodeColumn } from 'src/view/store/helpers/find-node-column';
import { id } from 'src/helpers/id';
import { sortGroups } from 'src/view/store/helpers/sort-groups';

export const moveNodeAsChild = (
    matrix: Matrix,
    action: DropAction,
    droppedNode: MatrixNode,
    targetNode: MatrixNode,
) => {
    const currentGroup = findGroup(matrix, droppedNode);
    if (!currentGroup) return;
    currentGroup.nodes = currentGroup.nodes.filter(
        (n) => n.id !== droppedNode.id,
    );
    const targetGroup = findChildGroup(matrix, targetNode);
    droppedNode.parentId = targetNode.id;
    if (targetGroup) {
        targetGroup.nodes.push(droppedNode);
    } else {
        const currentColumnIndex = findNodeColumn(matrix, targetNode.parentId);
        const currentColumn = matrix[currentColumnIndex];
        let targetColumn: Column | undefined;
        targetColumn = matrix[currentColumnIndex + 1];

        if (!targetColumn) {
            const newColumn = {
                id: id.column(),
                groups: [],
            };
            matrix.push(newColumn);
            targetColumn = newColumn;
        }
        targetColumn.groups.push({
            nodes: [droppedNode],
            id: id.group(),
            parentId: targetNode.id,
        });
        targetColumn.groups = sortGroups(
            currentColumn.groups,
            targetColumn.groups,
        );
    }
};
