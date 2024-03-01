import { cachedFindNode } from 'src/stores/document/helpers/search/cached-find-node';
import {
    AllDirections,
    ColumnNode,
    DocumentState,
} from 'src/stores/document/document-reducer';
import { findAdjacentNode } from 'src/stores/document/helpers/search/find-adjacent-node';
import { changeNodePosition } from 'src/stores/document/reducers/structure/move-node/helpers/change-node-position';
import { updateActiveNode } from 'src/stores/document/reducers/state/update-active-node';
import { findNodeColumn } from 'src/stores/document/helpers/find-node-column';

export type MoveNodeAction = {
    type: 'MOVE_NODE';
    payload: {
        direction: AllDirections;
    };
};

export const moveNode = (state: DocumentState, action: MoveNodeAction) => {
    const columns = state.columns;
    const movedNode = cachedFindNode(columns, state.state.activeBranch.node);
    if (!movedNode) throw new Error('could not find node');

    let targetNode: ColumnNode | null = null;
    if (action.payload.direction === 'left') {
        targetNode = cachedFindNode(state.columns, movedNode.parentId);
    } else {
        targetNode = findAdjacentNode(
            columns,
            movedNode,
            action.payload.direction === 'right'
                ? 'up'
                : action.payload.direction,
        );
    }
    // if first node of column is trying to move right, move it under the node below
    if (!targetNode && action.payload.direction === 'right') {
        const columnIndex = findNodeColumn(state.columns, movedNode.parentId);
        const isFirstNodeOfColumn =
            columns[columnIndex].groups[0]?.nodes[0] === movedNode;
        if (isFirstNodeOfColumn) {
            targetNode = findAdjacentNode(columns, movedNode, 'down');
        }
    }

    if (movedNode && targetNode) {
        changeNodePosition(
            state,
            movedNode,
            targetNode,
            action.payload.direction,
        );
        updateActiveNode(state, movedNode.id);
    }
};
