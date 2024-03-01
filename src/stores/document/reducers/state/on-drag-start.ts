import { cachedFindNode } from 'src/stores/document/helpers/search/cached-find-node';
import { DocumentState } from 'src/stores/document/document-reducer';
import { traverseDown } from 'src/stores/document/helpers/search/traverse-down';

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
    const node = cachedFindNode(state.columns, action.payload.nodeId);
    if (node) {
        const childGroups = new Set<string>();
        traverseDown(childGroups, new Set<string>(), state.columns, node);
        state.state.draggedBranch.node = action.payload.nodeId;
        state.state.draggedBranch.childGroups = childGroups;
    }
};
