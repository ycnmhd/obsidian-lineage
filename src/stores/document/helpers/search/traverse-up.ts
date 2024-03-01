import { ColumnNode, Columns } from 'src/stores/document/document-reducer';
import { findNodeColumn } from 'src/stores/document/helpers/find-node-column';

export const traverseUp = (columns: Columns, node: ColumnNode) => {
    const parents: ColumnNode[] = [];
    const nodeColumnIndex = findNodeColumn(columns, node.parentId);
    if (nodeColumnIndex > 0) {
        let currentParentId = node.parentId;
        for (let i = nodeColumnIndex - 1; i >= 0; i--) {
            const column = columns[i];
            for (const group of column.groups) {
                const parentIndex = group.nodes.findIndex(
                    (n) => n.id === currentParentId,
                );
                if (parentIndex !== -1) {
                    const parent = group.nodes[parentIndex];
                    parents.push(parent);
                    currentParentId = parent.id;
                    break;
                }
            }
        }
    }
    return parents;
};
