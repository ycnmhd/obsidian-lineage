import { findNodeColumn } from 'src/lib/tree-utils/find/find-node-column';
import { findChildGroup } from 'src/lib/tree-utils/find/find-child-group';
import {
    Column,
    LineageDocument,
    NodeId,
} from 'src/stores/document/document-state-type';
import { createColumn } from 'src/lib/tree-utils/create/create-column';
import { createGroup } from 'src/lib/tree-utils/create/create-group';

export const moveNodeAsChild = (
    document: Pick<LineageDocument, 'columns'>,
    node: NodeId,
    targetNode: NodeId,
) => {
    const targetGroup = findChildGroup(document.columns, targetNode);
    if (targetGroup) {
        targetGroup.nodes.push(node);
        targetGroup.nodes = [...targetGroup.nodes];
    } else {
        const currentColumnIndex = findNodeColumn(document.columns, targetNode);
        let targetColumn: Column | undefined;
        targetColumn = document.columns[currentColumnIndex + 1];

        if (!targetColumn) {
            const newColumn = createColumn();
            document.columns.push(newColumn);
            document.columns = [...document.columns];
            targetColumn = newColumn;
        }
        const newGroup = createGroup(targetNode);
        newGroup.nodes.push(node);
        targetColumn.groups.push(newGroup);
        targetColumn.groups = [...targetColumn.groups];
    }
};
