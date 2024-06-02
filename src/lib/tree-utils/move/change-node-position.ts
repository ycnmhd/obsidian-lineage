import { AllDirections } from 'src/stores/document/document-store-actions';
import { moveNodeAsChild } from 'src/lib/tree-utils/move/move-node-as-child';
import { moveNodeAsSibling } from 'src/lib/tree-utils/move/move-node-as-sibling';
import { moveChildGroupsNextToTheirParent } from 'src/lib/tree-utils/move/move-child-groups-next-to-their-parent';
import {
    LineageDocument,
    NodeId,
} from 'src/stores/document/document-state-type';
import { findGroupByNodeId } from 'src/lib/tree-utils/find/find-group-by-node-id';
import invariant from 'tiny-invariant';
import { deleteNodeById } from 'src/lib/tree-utils/delete/delete-node-by-id';

export const changeNodePosition = (
    document: Pick<LineageDocument, 'columns'>,
    node: NodeId,
    targetNode: NodeId,
    direction: AllDirections,
    type: 'move' | 'drop',
) => {
    const group = findGroupByNodeId(document.columns, node);
    invariant(group);
    deleteNodeById(document.columns, null, node);
    if (direction === 'right') {
        moveNodeAsChild(document, node, targetNode);
    } else {
        moveNodeAsSibling(
            document.columns,
            direction,
            node,
            targetNode,
            type === 'move' && direction !== 'left' ? group : undefined,
        );
    }
    moveChildGroupsNextToTheirParent(document, node);
};
