import { Columns } from '../document-reducer';

export const findNodeColumn = (columns: Columns, parentId: string) => {
    for (let i = 0; i < columns.length; i++) {
        const column = columns[i];
        for (const group of column.groups) {
            if (group.parentId === parentId) return i;
        }
    }
    return -1;
};
