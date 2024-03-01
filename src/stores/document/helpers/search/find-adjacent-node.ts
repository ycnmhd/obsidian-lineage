import {
    Column,
    ColumnNode,
    VerticalDirection,
} from 'src/stores/document/document-reducer';
import { findNodeColumn } from 'src/stores/document/helpers/find-node-column';

export const findAdjacentNode = (
    columns: Column[],
    node: ColumnNode,
    position: VerticalDirection,
) => {
    const columnIndex = findNodeColumn(columns, node.parentId);
    const column = columns[columnIndex];
    const flatColumn = column.groups.map((g) => g.nodes).flat();
    const nodeIndex = flatColumn.findIndex((n) => n.id === node.id);
    return flatColumn[nodeIndex + (position === 'up' ? -1 : 1)];
};
