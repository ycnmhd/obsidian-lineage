import { Column, NodeId } from 'src/stores/view/view-state-type';
import { JumpTarget } from 'src/stores/view/reducers/document/state/jump-to-node';
import { findNodeColumn } from 'src/stores/view/helpers/find-node-column';

export const findNodeToJumpTo = (
    columns: Column[],
    node: NodeId,
    target: JumpTarget,
) => {
    const columnIndex = findNodeColumn(columns, node);
    const column = columns[columnIndex];
    if (target === 'start-of-column') {
        return column.groups[0].nodes[0];
    } else if (target === 'end-of-column') {
        const nodeGroup = column.groups[column.groups.length - 1];
        return nodeGroup.nodes[nodeGroup.nodes.length - 1];
    } else {
        const group = column.groups.find((g) => g.nodes.includes(node));
        if (group) {
            if (target === 'start-of-group') return group.nodes[0];
            else if (target === 'end-of-group') {
                return group.nodes[group.nodes.length - 1];
            }
        }
    }
};
