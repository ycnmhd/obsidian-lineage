import { insertChild } from 'src/stores/view/reducers/document/structure/insert-node/helpers/insert-child';
import { findNodeColumn } from 'src/stores/view/helpers/find-node-column';
import { createNode } from 'src/stores/view/helpers/create-node';
import { Direction } from 'src/stores/view/view-reducer';
import { updateActiveNode } from 'src/stores/view/reducers/document/state/helpers/update-active-node';
import { findGroupByNodeId } from 'src/stores/view/helpers/search/find-group-by-node-id';
import {
    Column,
    Content,
    DocumentInstanceState,
    NodeId,
} from 'src/stores/view/view-state-type';

export type CreateNodeAction = {
    type: 'DOCUMENT/INSERT_NODE';
    payload: {
        position: Direction;
        content?: string;
        __newNodeID__?: string;
    };
};
export const insertNode = (
    columns: Column[],
    state: DocumentInstanceState,
    content: Content,
    action: CreateNodeAction,
) => {
    const payload = action.payload;
    const nodeId = state.activeBranch.node;
    if (!nodeId) return;
    let createdNode: NodeId | null = null;
    if (payload.position === 'right') {
        createdNode = insertChild(
            columns,
            nodeId,
            action.payload.__newNodeID__,
        );
    } else {
        const columnIndex = findNodeColumn(columns, nodeId);
        const column = columns[columnIndex];
        const group = findGroupByNodeId([column], nodeId);
        if (group) {
            const index = group.nodes.findIndex((c) => c === nodeId);
            if (columnIndex !== -1 && index !== -1) {
                const insertionIndex =
                    action.payload.position === 'up' ? index : index + 1;
                createdNode = createNode(action.payload.__newNodeID__);
                group.nodes.splice(insertionIndex, 0, createdNode);
            }
        }
    }
    if (createdNode) {
        content[createdNode] = action.payload.content
            ? {
                  content: action.payload.content,
              }
            : null;
        updateActiveNode(columns, state, createdNode, true);
        return true;
    }
};
