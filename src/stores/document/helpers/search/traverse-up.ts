import { findNodeColumn } from 'src/stores/document/helpers/find-node-column';
import { ColumnNode, Columns } from 'src/stores/document/document-type';
import { findGroupByNodeId } from 'src/stores/document/helpers/search/find-group-by-node-id';

export const traverseUp = (columns: Columns, node: ColumnNode) => {
    const parents: ColumnNode[] = [];
    const nodeColumnIndex = findNodeColumn(columns, node);
    if (nodeColumnIndex > 0) {
        const group = findGroupByNodeId(columns, node);
        if (group) {
            let currentParentId = group.parentId;
            for (let i = nodeColumnIndex - 1; i >= 0; i--) {
                const column = columns[i];
                for (const group of column.groups) {
                    if (!currentParentId) currentParentId = group.parentId;
                    const parentIndex = group.nodes.findIndex(
                        (n) => n === currentParentId,
                    );
                    if (parentIndex !== -1) {
                        const parent = group.nodes[parentIndex];
                        parents.push(parent);
                        currentParentId = group.parentId;
                        break;
                    }
                }
            }
        }
    }
    return parents;
};
