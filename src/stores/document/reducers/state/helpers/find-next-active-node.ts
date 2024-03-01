import {
    ColumnNode,
    DocumentState,
} from 'src/stores/document/document-reducer';
import { cachedFindNode } from 'src/stores/document/helpers/search/cached-find-node';
import { findNodeColumn } from 'src/stores/document/helpers/find-node-column';
import { findChildGroup } from 'src/stores/document/helpers/search/find-child-group';
import { ChangeActiveNodeAction } from 'src/stores/document/reducers/state/change-active-node';

export const findNextActiveNode = (
    state: DocumentState,
    action: ChangeActiveNodeAction,
) => {
    const columns = state.columns;
    const node = cachedFindNode(columns, state.state.activeBranch.node);
    if (!node) return;
    const columnIndex = findNodeColumn(columns, node.parentId);
    const column = columns[columnIndex];
    if (!column) return;
    let nextNode: ColumnNode | null = null;
    if (action.payload.direction === 'left') {
        nextNode = cachedFindNode(columns, node.parentId);
    } else if (action.payload.direction === 'right') {
        const group = findChildGroup(columns, node);
        if (group) {
            nextNode = group.nodes[0];
        }
        // commenting this because a childless node should not be able to navigate right
        /*else {
			const nextColumn = columns[columnIndex + 1];
			if (!nextColumn) return;
			nextNode = nextColumn.groups[0]?.nodes?.[0];
		}*/
    } else {
        const allNodes = column.groups.map((g) => g.nodes).flat();
        const nodeIndex = allNodes.findIndex((n) => n.id === node.id);

        if (action.payload.direction === 'up') {
            if (nodeIndex > 0) {
                nextNode = allNodes[nodeIndex - 1];
            }
        } else if (action.payload.direction === 'down') {
            if (nodeIndex < allNodes.length - 1) {
                nextNode = allNodes[nodeIndex + 1];
            }
        }
    }
    return nextNode;
};
