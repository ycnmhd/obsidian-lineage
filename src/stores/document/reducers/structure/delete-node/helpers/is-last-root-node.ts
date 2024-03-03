import { Column, NodeId } from 'src/stores/document/document-type';

export const isLastRootNode = (columns: Column[], node: NodeId): boolean => {
    const column = columns[0];

    if (column.groups.length === 1) {
        const group = column.groups[0];

        if (group.nodes.length === 1 && group.nodes[0] === node) return true;
    }
    return false;
};
