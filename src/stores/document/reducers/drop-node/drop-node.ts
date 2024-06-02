import { Direction } from 'src/stores/document/document-store-actions';
import { changeNodePosition } from 'src/lib/tree-utils/move/change-node-position';
import { LineageDocument } from 'src/stores/document/document-state-type';
import { cleanAndSortColumns } from 'src/lib/tree-utils/sort/clean-and-sort-columns';
import invariant from 'tiny-invariant';

export type DropAction = {
    type: 'DOCUMENT/DROP_NODE';
    payload: {
        droppedNodeId: string;
        targetNodeId: string;
        position: Direction;
    };
};

export const dropNode = (
    document: Pick<LineageDocument, 'columns'>,
    action: Pick<DropAction, 'payload'>,
) => {
    const droppedNode = action.payload.droppedNodeId;
    const targetNode = action.payload.targetNodeId;
    invariant(droppedNode);
    invariant(targetNode);
    changeNodePosition(
        document,
        droppedNode,
        targetNode,
        action.payload.position,
        'drop',
    );

    cleanAndSortColumns(document);
};
