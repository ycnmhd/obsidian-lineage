import { ColumnNode, Columns } from 'src/stores/document/document-reducer';

export const findGroup = (
    columns: Columns,
    node: Pick<ColumnNode, 'parentId'>,
) => {
    for (const column of columns) {
        for (const group of column.groups) {
            if (group.parentId === node.parentId) {
                return group;
            }
        }
    }
};
