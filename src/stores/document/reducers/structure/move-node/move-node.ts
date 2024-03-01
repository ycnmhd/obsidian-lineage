import { findGroupByNodeId } from 'src/stores/document/helpers/search/find-group-by-node-id';
import { ColumnNode, DocumentState } from 'src/stores/document/document-type';
import { AllDirections } from 'src/stores/document/document-reducer';
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
    const columns = state.document.columns;
    const movedNode = state.state.activeBranch.node;
    if (!movedNode) throw new Error('no active node');

    let targetNode: ColumnNode | null = null;
    if (action.payload.direction === 'left') {
        const group = findGroupByNodeId(state.document.columns, movedNode);
        if (group && !group.parentId.startsWith('r-'))
            targetNode = group.parentId;
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
        const columnIndex = findNodeColumn(state.document.columns, movedNode);
        const isFirstNodeOfColumn =
            columns[columnIndex].groups[0]?.nodes[0] === movedNode;
        if (isFirstNodeOfColumn) {
            targetNode = findAdjacentNode(columns, movedNode, 'down');
        }
    }

    if (movedNode && targetNode) {
        changeNodePosition(
            state.document,
            movedNode,
            targetNode,
            action.payload.direction,
        );
        updateActiveNode(state, movedNode);
    }
};
