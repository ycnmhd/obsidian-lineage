import { Direction } from 'src/stores/document/document-reducer';
import { changeNodePosition } from 'src/stores/document/reducers/structure/move-node/helpers/change-node-position';
import {
    Column,
    DocumentInstanceState,
} from 'src/stores/document/document-type';
import { cleanAndSortColumns } from 'src/stores/document/reducers/state/shared/clean-and-sort-columns';
import { updateActiveNode } from 'src/stores/document/reducers/state/shared/update-active-node';
import { onDragEnd } from 'src/stores/document/reducers/state/on-drag-end';

export type DropAction = {
    type: 'DROP_NODE';
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
