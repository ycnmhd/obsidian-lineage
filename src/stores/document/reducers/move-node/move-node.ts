import { AllDirections } from 'src/stores/document/document-store-actions';
import { changeNodePosition } from 'src/lib/tree-utils/move/change-node-position';
import { findAdjacentNode } from 'src/lib/tree-utils/find/find-adjacent-node';
import { cleanAndSortColumns } from 'src/lib/tree-utils/sort/clean-and-sort-columns';
import invariant from 'tiny-invariant';
import { SilentError } from 'src/lib/errors/errors';
import { LineageDocument } from 'src/stores/document/document-state-type';

export type MoveNodeAction = {
    type: 'DOCUMENT/MOVE_NODE';
    payload: {
        direction: AllDirections;
        activeNodeId: string;
    };
};

export const moveNode = (
    document: Pick<LineageDocument, 'columns'>,
    action: Pick<MoveNodeAction, 'payload'>,
) => {
    const nodeToMove = action.payload.activeNodeId;
    invariant(nodeToMove);

    const targetNode = findAdjacentNode(
        document.columns,
        nodeToMove,
        action.payload.direction,
    );
    if (!targetNode) throw new SilentError('could not find adjacent node');
    changeNodePosition(
        document,
        nodeToMove,
        targetNode,
        action.payload.direction,
        'move',
    );
    cleanAndSortColumns(document);
};
