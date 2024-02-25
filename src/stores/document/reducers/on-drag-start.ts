import { findNode } from 'src/stores/document/helpers/find-node';
import { traverseDown } from 'src/stores/document/helpers/find-branch';
import { DocumentState } from 'src/stores/document/document-reducer';

export type SetDragStartedAction = {
    type: 'SET_DRAG_STARTED';
    payload: {
        nodeId: string;
    };
};
export const onDragStart = (
    state: DocumentState,
    action: SetDragStartedAction,
) => {
    const node = findNode(state.columns, action.payload.nodeId);
    if (node) {
        const childGroups = new Set<string>();
        traverseDown(childGroups, new Set<string>(), state.columns, node);
        state.state.draggedBranch.node = action.payload.nodeId;
        state.state.draggedBranch.childGroups = childGroups;
    }
};
