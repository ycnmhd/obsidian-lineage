import { NodeId, Columns } from 'src/stores/document/document-type';

export const findChildGroup = (columns: Columns, node: NodeId) => {
    for (const column of columns) {
        for (const group of column.groups) {
            if (group.parentId === node) {
                return group;
            }
        }
    }
};
