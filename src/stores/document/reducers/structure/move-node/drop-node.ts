import { cachedFindNode } from 'src/stores/document/helpers/search/cached-find-node';
import { Direction, DocumentState } from 'src/stores/document/document-reducer';
import { changeNodePosition } from 'src/stores/document/reducers/structure/move-node/helpers/change-node-position';

export type DropAction = {
    type: 'DROP_NODE';
    payload: {
        droppedNodeId: string;
        targetNodeId: string;
        position: Direction;
    };
};

export const dropNode = (
    state: Pick<DocumentState, 'columns'>,
    action: DropAction,
) => {
    const columns = state.columns;
    const droppedNode = cachedFindNode(columns, action.payload.droppedNodeId);
    const targetNode = cachedFindNode(columns, action.payload.targetNodeId);
    if (droppedNode && targetNode) {
        changeNodePosition(
            state,
            droppedNode,
            targetNode,
            action.payload.position,
        );
    }
};
