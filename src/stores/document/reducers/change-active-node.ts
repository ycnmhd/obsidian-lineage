import { findNode } from 'src/stores/document/helpers/find-node';
import { findNodeColumn } from 'src/stores/document/helpers/find-node-column';
import { findChildGroup } from 'src/stores/document/helpers/find-branch';
import { updateActiveNode } from 'src/stores/document/helpers/update-active-node';
import {
    ColumnNode,
    DocumentState,
    NodeDirection,
} from 'src/stores/document/document-reducer';

export type ChangeActiveNodeAction = {
    type: 'CHANGE_ACTIVE_NODE';
    payload: {
        direction: NodeDirection | 'left';
    };
};
export const changeActiveNode = (
    state: DocumentState,
    action: ChangeActiveNodeAction,
) => {
    const columns = state.columns;
    const node = findNode(columns, state.state.activeBranch.node);
    if (!node) return;
    const columnIndex = findNodeColumn(columns, node.parentId);
    const column = columns[columnIndex];
    if (!column) return;
    let nextNode: ColumnNode | null = null;
    if (action.payload.direction === 'left') {
        nextNode = findNode(columns, node.parentId);
    } else if (action.payload.direction === 'right') {
        const group = findChildGroup(columns, node);
        if (group) {
            nextNode = group.nodes[0];
        } else {
            const nextColumn = columns[columnIndex + 1];
            if (!nextColumn) return;
            nextNode = nextColumn.groups[0]?.nodes?.[0];
        }
    } else {
        const allNodes = column.groups.map((g) => g.nodes).flat();
        const nodeIndex = allNodes.findIndex((n) => n.id === node.id);

        if (action.payload.direction === 'top') {
            if (nodeIndex > 0) {
                nextNode = allNodes[nodeIndex - 1];
            }
        } else if (action.payload.direction === 'bottom') {
            if (nodeIndex < allNodes.length - 1) {
                nextNode = allNodes[nodeIndex + 1];
            }
        }
    }
    if (nextNode) {
        updateActiveNode(state, nextNode.id);
    }
};
