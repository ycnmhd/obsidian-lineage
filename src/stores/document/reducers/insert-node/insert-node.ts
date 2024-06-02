import { insertChild } from 'src/lib/tree-utils/insert/insert-child';
import { findNodeColumn } from 'src/lib/tree-utils/find/find-node-column';
import { Direction } from 'src/stores/document/document-store-actions';
import { findGroupByNodeId } from 'src/lib/tree-utils/find/find-group-by-node-id';
import { LineageDocument } from 'src/stores/document/document-state-type';
import invariant from 'tiny-invariant';
import { id } from 'src/helpers/id';

export type CreateNodeAction = {
    type: 'DOCUMENT/INSERT_NODE';
    payload: {
        position: Direction;
        activeNodeId: string;
        content?: string;
    };
};
export const insertNode = (
    document: LineageDocument,
    action: Pick<CreateNodeAction, 'payload'>,
    newNodeId = id.node(),
) => {
    const payload = action.payload;
    invariant(payload.activeNodeId);

    if (payload.position === 'right') {
        insertChild(document, payload.activeNodeId, newNodeId);
    } else {
        const columnIndex = findNodeColumn(
            document.columns,
            payload.activeNodeId,
        );
        const column = document.columns[columnIndex];
        invariant(column);
        const group = findGroupByNodeId([column], payload.activeNodeId);
        invariant(group, 'could not find group of ' + payload.activeNodeId);

        const groupIndex = group.nodes.findIndex(
            (c) => c === payload.activeNodeId,
        );

        const insertionIndex =
            action.payload.position === 'up' ? groupIndex : groupIndex + 1;
        group.nodes.splice(insertionIndex, 0, newNodeId);
        group.nodes = [...group.nodes];
    }
    document.content[newNodeId] = {
        content: action.payload.content || '',
    };

    return newNodeId;
};
