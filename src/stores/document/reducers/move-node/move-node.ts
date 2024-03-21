import { Column } from 'src/stores/document/document-state-type';
import { AllDirections } from 'src/stores/document/document-store-actions';
import { changeNodePosition } from 'src/stores/document/reducers/move-node/helpers/change-node-position';
import { findAdjacentNode } from 'src/stores/document/reducers/move-node/helpers/find-adjacent-node';
import { cleanAndSortColumns } from 'src/stores/document/reducers/move-node/helpers/clean-and-sort-columns';
import invariant from 'tiny-invariant';

export type MoveNodeAction = {
    type: 'DOCUMENT/MOVE_NODE';
    payload: {
        direction: AllDirections;
        activeNodeId: string;
    };
};

export const moveNode = (columns: Column[], action: MoveNodeAction) => {
    const nodeToMove = action.payload.activeNodeId;
    invariant(nodeToMove);

    const targetNode = findAdjacentNode(
        columns,
        nodeToMove,
        action.payload.direction,
    );
    if (!targetNode) return true;
    changeNodePosition(
        columns,
        nodeToMove,
        targetNode,
        action.payload.direction,
    );
    cleanAndSortColumns(columns);
};
