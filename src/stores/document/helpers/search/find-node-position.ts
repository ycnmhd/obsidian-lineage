import {
    ColumnNode,
    Columns,
    NodeGroup,
} from 'src/stores/document/document-type';

export type NodePosition = {
    columnIndex: number;
    groupIndex: number;
    nodeIndex: number;
};
export const findNodePosition = (
    columns: Columns,
    node: ColumnNode,
): NodePosition | null => {
    for (let columnIndex = 0; columnIndex < columns.length; columnIndex++) {
        const column = columns[columnIndex];
        for (
            let groupIndex = 0;
            groupIndex < column.groups.length;
            groupIndex++
        ) {
            const group = column.groups[groupIndex] as NodeGroup;
            const nodeIndex = group.nodes.findIndex((n) => n === node);
            if (nodeIndex !== -1) {
                return {
                    columnIndex,
                    groupIndex,
                    nodeIndex,
                };
            }
        }
    }
    return null;
};
