import {
    Column,
    ColumnNode,
    Columns,
} from 'src/stores/document/document-reducer';
import {
    findChildGroup,
    findGroup,
} from 'src/stores/document/helpers/find-branch';
import { findNodeColumn } from 'src/stores/document/helpers/find-node-column';
import {
    createColumn,
    createGroup,
} from 'src/stores/document/helpers/create-node';

export const moveNodeAsChild = (
    columns: Columns,
    droppedNode: ColumnNode,
    targetNode: ColumnNode,
) => {
    const currentGroup = findGroup(columns, droppedNode);
    if (!currentGroup) return;
    currentGroup.nodes = currentGroup.nodes.filter(
        (n) => n.id !== droppedNode.id,
    );
    const targetGroup = findChildGroup(columns, targetNode);
    droppedNode.parentId = targetNode.id;
    if (targetGroup) {
        targetGroup.nodes.push(droppedNode);
    } else {
        const currentColumnIndex = findNodeColumn(columns, targetNode.parentId);
        let targetColumn: Column | undefined;
        targetColumn = columns[currentColumnIndex + 1];

        if (!targetColumn) {
            const newColumn = createColumn();
            columns.push(newColumn);
            targetColumn = newColumn;
        }
        const newGroup = createGroup(targetNode.id);
        newGroup.nodes.push(droppedNode);
        targetColumn.groups.push(newGroup);
    }
};
