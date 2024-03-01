import {
    ColumnNode,
    Columns,
    NodeGroup,
} from 'src/stores/document/document-reducer';

import { NodePosition } from 'src/stores/document/helpers/search/find-node-position';

export const findNodeAtPosition = (
    columns: Columns,
    position: NodePosition,
): ColumnNode | null => {
    const { columnIndex, groupIndex, nodeIndex } = position;

    if (columnIndex < 0 || columnIndex >= columns.length) {
        return null;
    }

    const column = columns[columnIndex];
    if (groupIndex < 0 || groupIndex >= column.groups.length) {
        return null;
    }

    const group = column.groups[groupIndex] as NodeGroup;
    if (nodeIndex < 0 || nodeIndex >= group.nodes.length) {
        return null;
    }

    return group.nodes[nodeIndex];
};
