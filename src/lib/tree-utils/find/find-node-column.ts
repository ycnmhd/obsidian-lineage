import { Columns } from 'src/stores/document/document-state-type';

export const findNodeColumn = (columns: Columns, nodeId: string) => {
    for (let i = 0; i < columns.length; i++) {
        const column = columns[i];
        for (const group of column.groups) {
            if (group.nodes.find((n) => n === nodeId)) return i;
        }
    }
    return -1;
};
