import { Direction } from 'src/stores/document/document-reducer';
import { changeNodePosition } from 'src/stores/document/reducers/structure/move-node/helpers/change-node-position';
import { LineageDocument } from 'src/stores/document/document-type';

export type DropAction = {
    type: 'DROP_NODE';
    payload: {
        droppedNodeId: string;
        targetNodeId: string;
        position: Direction;
    };
};

export const dropNode = (
    state: Pick<LineageDocument, 'columns'>,
    action: DropAction,
) => {
    const droppedNode = action.payload.droppedNodeId;
    const targetNode = action.payload.targetNodeId;
    if (droppedNode && targetNode) {
        changeNodePosition(
            state,
            droppedNode,
            targetNode,
            action.payload.position,
        );
    }
};
