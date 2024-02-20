import { Matrix } from '../document.store';

export const findNodeColumn = (matrix: Matrix, parentId: string) => {
    for (let i = 0; i < matrix.length; i++) {
        const column = matrix[i];
        for (const group of column.groups) {
            if (group.parentId === parentId) return i;
        }
    }
    return -1;
};
