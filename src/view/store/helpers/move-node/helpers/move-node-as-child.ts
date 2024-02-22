import {
    Column,
    ColumnNode,
    Columns,
    DropAction,
} from 'src/view/store/document-reducer';
import { findChildGroup, findGroup } from 'src/view/store/helpers/find-branch';
import { findNodeColumn } from 'src/view/store/helpers/find-node-column';
import { sortGroups } from 'src/view/store/helpers/sort-groups';
import { createColumn, createGroup } from 'src/view/store/helpers/create-node';

export const moveNodeAsChild = (
    columns: Columns,
    action: DropAction,
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
        const currentColumn = columns[currentColumnIndex];
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
        targetColumn.groups = sortGroups(
            currentColumn.groups,
            targetColumn.groups,
        );
    }
};
