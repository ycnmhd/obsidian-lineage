import { Direction } from 'src/stores/view/view-reducer';
import { changeNodePosition } from 'src/stores/view/reducers/document/structure/helpers/change-node-position';
import { Column, DocumentInstanceState } from 'src/stores/view/view-state-type';
import { cleanAndSortColumns } from 'src/stores/view/reducers/document/state/helpers/clean-and-sort-columns';
import { updateActiveNode } from 'src/stores/view/reducers/document/state/helpers/update-active-node';
import { onDragEnd } from 'src/stores/view/reducers/document/state/on-drag-end';

export type DropAction = {
    type: 'DOCUMENT/DROP_NODE';
    payload: {
        droppedNodeId: string;
        targetNodeId: string;
        position: Direction;
    };
};

export const dropNode = (
    columns: Column[],
    state: DocumentInstanceState,
    action: DropAction,
) => {
    const droppedNode = action.payload.droppedNodeId;
    const targetNode = action.payload.targetNodeId;
    if (droppedNode && targetNode) {
        changeNodePosition(
            columns,
            droppedNode,
            targetNode,
            action.payload.position,
        );

        cleanAndSortColumns(columns);
        onDragEnd(state.dnd);
        updateActiveNode(columns, state, action.payload.droppedNodeId);
    }
};
