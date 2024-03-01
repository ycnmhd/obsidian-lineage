import { StringSet } from 'src/stores/document/helpers/search/traverse-down';
import { findGroupByNodeId } from 'src/stores/document/helpers/search/find-group-by-node-id';
import { ColumnNode, Columns } from 'src/stores/document/document-type';

export const findSiblings = (
    siblingNodes: StringSet,
    columns: Columns,
    node: ColumnNode,
) => {
    const group = findGroupByNodeId(columns, node);
    if (group)
        for (const groupNode of group.nodes) {
            if (groupNode !== node) siblingNodes.add(groupNode);
        }
};
