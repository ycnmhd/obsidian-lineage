import { findNode } from 'src/view/store/helpers/find-node';
import { traverseDown } from 'src/view/store/helpers/find-branch';
import { DocumentState } from 'src/view/store/document-reducer';

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
