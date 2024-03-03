import {
    Column,
    DocumentInstanceState,
} from 'src/stores/document/document-type';
import { AllDirections } from 'src/stores/document/document-reducer';
import { changeNodePosition } from 'src/stores/document/reducers/structure/move-node/helpers/change-node-position';
import { updateActiveNode } from 'src/stores/document/reducers/state/shared/update-active-node';
import { findAdjacentNode } from 'src/stores/document/reducers/structure/move-node/helpers/find-adjacent-node';
import { cleanAndSortColumns } from 'src/stores/document/reducers/state/shared/clean-and-sort-columns';

export type MoveNodeAction = {
    type: 'MOVE_NODE';
    payload: {
        direction: AllDirections;
    };
};

export const moveNode = (
    columns: Column[],
    state: DocumentInstanceState,
    action: MoveNodeAction,
) => {
    const nodeToMove = state.activeBranch.node;
    if (!nodeToMove) return;

    const targetNode = findAdjacentNode(
        columns,
        state.activeBranch,
        action.payload.direction,
    );
    if (nodeToMove && targetNode) {
        changeNodePosition(
            columns,
            nodeToMove,
            targetNode,
            action.payload.direction,
        );
        cleanAndSortColumns(columns);
        updateActiveNode(columns, state, nodeToMove);
    }
};
