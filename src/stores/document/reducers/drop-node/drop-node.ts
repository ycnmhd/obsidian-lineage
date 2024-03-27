import { Direction } from 'src/stores/document/document-store-actions';
import { changeNodePosition } from 'src/stores/document/reducers/move-node/helpers/change-node-position';
import { Column } from 'src/stores/document/document-state-type';
import { cleanAndSortColumns } from 'src/stores/document/reducers/move-node/helpers/clean-and-sort-columns';
import invariant from 'tiny-invariant';

export type DropAction = {
    type: 'DOCUMENT/DROP_NODE';
    payload: {
        droppedNodeId: string;
        targetNodeId: string;
        position: Direction;
    };
};

export const dropNode = (columns: Column[], action: DropAction) => {
    const droppedNode = action.payload.droppedNodeId;
    const targetNode = action.payload.targetNodeId;
    invariant(droppedNode);
    invariant(targetNode);
    changeNodePosition(
        columns,
        droppedNode,
        targetNode,
        action.payload.position,
    );

    cleanAndSortColumns(columns);
};
