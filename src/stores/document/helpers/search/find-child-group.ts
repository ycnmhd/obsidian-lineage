import { ColumnNode, Columns } from 'src/stores/document/document-reducer';

export const findChildGroup = (
    columns: Columns,
    node: Pick<ColumnNode, 'id'>,
) => {
    for (const column of columns) {
        for (const group of column.groups) {
            if (group.parentId === node.id) {
                return group;
            }
        }
    }
};
