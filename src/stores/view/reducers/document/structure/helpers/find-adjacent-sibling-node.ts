import { VerticalDirection } from 'src/stores/view/view-store-actions';
import { findNodeColumn } from 'src/stores/view/helpers/find-node-column';
import { Column, NodeId } from 'src/stores/view/view-state-type';

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
