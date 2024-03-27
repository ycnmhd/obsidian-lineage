import { insertChild } from 'src/stores/document/reducers/insert-node/helpers/insert-child';
import { findNodeColumn } from 'src/stores/view/helpers/find-node-column';
import { Direction } from 'src/stores/document/document-store-actions';
import { findGroupByNodeId } from 'src/stores/view/helpers/search/find-group-by-node-id';
import { Column, Content } from 'src/stores/document/document-state-type';
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
    columns: Column[],
    content: Content,
    action: CreateNodeAction,
) => {
    const payload = action.payload;
    invariant(payload.activeNodeId);

    const newNodeId = id.node();
    if (payload.position === 'right') {
        insertChild(columns, payload.activeNodeId, newNodeId);
    } else {
        const columnIndex = findNodeColumn(columns, payload.activeNodeId);
        const column = columns[columnIndex];
        const group = findGroupByNodeId([column], payload.activeNodeId);
        invariant(group, 'could not find group of ' + payload.activeNodeId);

        const groupIndex = group.nodes.findIndex(
            (c) => c === payload.activeNodeId,
        );
        if (columnIndex === -1 || groupIndex === -1)
            throw new Error('could not find node index');

        const insertionIndex =
            action.payload.position === 'up' ? groupIndex : groupIndex + 1;
        group.nodes.splice(insertionIndex, 0, newNodeId);
    }
    content[newNodeId] = action.payload.content
        ? {
              content: action.payload.content,
          }
        : null;
    return newNodeId;
};
