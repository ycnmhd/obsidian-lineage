import { Column, ColumnNode } from 'src/view/store/document-reducer';
import { findGroup } from 'src/view/store/helpers/find-branch';
import { findNodeColumn } from 'src/view/store/helpers/find-node-column';
import { findNode } from 'src/view/store/helpers/find-node';

export const findNextActiveNode = (columns: Column[], node: ColumnNode) => {
    let nextNode: ColumnNode | null = null;
    const group = findGroup(columns, node);
    const columnIndex = findNodeColumn(columns, node.parentId);
    const column = columns[columnIndex];
    if (group) {
        const nodeIndex = group.nodes.findIndex((n) => n.id === node.id);
        if (nodeIndex === 0) nextNode = group.nodes[1];
        else if (nodeIndex > 0) nextNode = group.nodes[nodeIndex - 1];
        else nextNode = group.nodes[group.nodes.length - 1];

        /* if (!nextNode) {
            const groupIndex = column.groups.indexOf(group);
            const groupAbove = column.groups[groupIndex - 1].nodes;
            nextNode = groupAbove[groupAbove.length - 1];
        }*/
    }
    if (!nextNode) {
        if (!node.parentId.startsWith('r-'))
            nextNode = findNode(columns, node?.parentId);
        else nextNode = column.groups[0].nodes[0];
    }
    return nextNode;
};
