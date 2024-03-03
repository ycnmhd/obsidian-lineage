import { Column, NodeId } from 'src/stores/document/document-type';
import { findGroupByNodeId } from 'src/stores/document/helpers/search/find-group-by-node-id';

export const removeNodeFromGroup = (columns: Column[], node: NodeId) => {
    const currentGroup = findGroupByNodeId(columns, node);
    if (currentGroup) {
        currentGroup.nodes = currentGroup.nodes.filter((n) => n !== node);
    }
};
