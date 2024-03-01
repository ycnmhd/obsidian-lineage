import {
    Column,
    ColumnNode,
    Columns,
} from 'src/stores/document/document-reducer';
import { findNodeColumn } from 'src/stores/document/helpers/find-node-column';
import {
    createColumn,
    createGroup,
} from 'src/stores/document/helpers/create-node';
import { findChildGroup } from 'src/stores/document/helpers/search/find-child-group';

export const moveNodeAsChild = (
    columns: Columns,
    node: ColumnNode,
    targetNode: ColumnNode,
) => {
    const targetGroup = findChildGroup(columns, targetNode);
    node.parentId = targetNode.id;
    if (targetGroup) {
        targetGroup.nodes.push(node);
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
        newGroup.nodes.push(node);
        targetColumn.groups.push(newGroup);
    }
};
