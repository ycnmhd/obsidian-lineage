import { VerticalDirection } from 'src/stores/document/document-reducer';

import { findGroupByNodeId } from 'src/stores/document/helpers/search/find-group-by-node-id';
import { NodeId, Columns } from 'src/stores/document/document-type';

export const moveNodeAsSibling = (
    columns: Columns,
    direction: VerticalDirection,
    node: NodeId,
    targetNode: NodeId,
) => {
    const targetGroup = findGroupByNodeId(columns, targetNode);
    if (targetGroup) {
        const index = targetGroup.nodes.findIndex((n) => n === targetNode);
        const insertionIndex = direction === 'up' ? index : index + 1;

        targetGroup.nodes.splice(insertionIndex, 0, node);
    }
};
