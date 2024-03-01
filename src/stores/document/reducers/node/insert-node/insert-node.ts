import { insertChild } from 'src/stores/document/reducers/node/insert-node/helpers/insert-child';
import { findNodeColumn } from 'src/stores/document/helpers/find-node-column';
import { createNode } from 'src/stores/document/helpers/create-node';
import { Direction } from 'src/stores/document/document-reducer';
import { updateActiveNode } from 'src/stores/document/reducers/state/update-active-node';
import { findGroupByNodeId } from 'src/stores/document/helpers/search/find-group-by-node-id';
import { ColumnNode, DocumentState } from 'src/stores/document/document-type';

export type CreateNodeAction = {
    type: 'CREATE_NODE';
    payload: {
        position: Direction;
        content?: string;
        __newNodeID__?: string;
    };
};
export const insertNode = (state: DocumentState, action: CreateNodeAction) => {
    const payload = action.payload;
    const nodeId = state.state.activeBranch.node;
    if (!nodeId) return;
    let createdNode: ColumnNode | null = null;
    if (payload.position === 'right') {
        createdNode = insertChild(
            state.document.columns,
            nodeId,
            action.payload.__newNodeID__,
        );
    } else {
        const columnIndex = findNodeColumn(state.document.columns, nodeId);
        const column = state.document.columns[columnIndex];
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
        if (action.payload.content) {
            state.document.content[createdNode] = {
                content: action.payload.content,
            };
        }
        updateActiveNode(state, createdNode, true);
    }
};
