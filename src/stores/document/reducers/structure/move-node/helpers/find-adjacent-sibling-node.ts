import { VerticalDirection } from 'src/stores/document/document-reducer';
import { findNodeColumn } from 'src/stores/document/helpers/find-node-column';
import { Column, NodeId } from 'src/stores/document/document-type';

export const findAdjacentSiblingNode = (
    columns: Column[],
    node: NodeId,
    direction: VerticalDirection,
) => {
    const columnIndex = findNodeColumn(columns, node);
    const column = columns[columnIndex];
    const flatColumn = column.groups.map((g) => g.nodes).flat();
    const nodeIndex = flatColumn.findIndex((n) => n === node);
    return flatColumn[nodeIndex + (direction === 'up' ? -1 : 1)];
};
