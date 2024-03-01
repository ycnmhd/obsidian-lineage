import { Column, ColumnNode } from 'src/stores/document/document-type';
import { findGroupByNodeId } from 'src/stores/document/helpers/search/find-group-by-node-id';

export const removeNodeFromGroup = (columns: Column[], node: ColumnNode) => {
    const currentGroup = findGroupByNodeId(columns, node);
    if (currentGroup) {
        currentGroup.nodes = currentGroup.nodes.filter((n) => n !== node);
    }
};
