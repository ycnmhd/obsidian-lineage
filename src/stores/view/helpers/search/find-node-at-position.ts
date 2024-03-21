import { NodePosition } from 'src/stores/view/helpers/search/find-node-position';
import {
    Columns,
    NodeGroup,
    NodeId,
} from 'src/stores/document/document-state-type';

export const findNodeAtPosition = (
    columns: Columns,
    position: NodePosition,
): NodeId | null => {
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
