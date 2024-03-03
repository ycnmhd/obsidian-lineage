import { StringSet } from 'src/stores/document/helpers/search/traverse-down';
import { findGroupByNodeId } from 'src/stores/document/helpers/search/find-group-by-node-id';
import { NodeId, Columns } from 'src/stores/document/document-type';

export const findSiblings = (
    siblingNodes: StringSet,
    columns: Columns,
    node: NodeId,
) => {
    const group = findGroupByNodeId(columns, node);
    if (group)
        for (const groupNode of group.nodes) {
            if (groupNode !== node) siblingNodes.add(groupNode);
        }
};
