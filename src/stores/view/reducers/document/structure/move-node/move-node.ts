import { Column, DocumentInstanceState } from 'src/stores/view/view-state-type';
import { AllDirections } from 'src/stores/view/view-reducer';
import { changeNodePosition } from 'src/stores/view/reducers/document/structure/helpers/change-node-position';
import { updateActiveNode } from 'src/stores/view/reducers/document/state/helpers/update-active-node';
import { findAdjacentNode } from 'src/stores/view/reducers/document/structure/helpers/find-adjacent-node';
import { cleanAndSortColumns } from 'src/stores/view/reducers/document/state/helpers/clean-and-sort-columns';

export type MoveNodeAction = {
    type: 'DOCUMENT/MOVE_NODE';
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
        return true;
    }
};
