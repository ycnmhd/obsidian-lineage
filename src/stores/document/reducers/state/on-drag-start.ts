import { traverseDown } from 'src/stores/document/helpers/search/traverse-down';
import { DocumentState } from 'src/stores/document/document-type';

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
    const node = action.payload.nodeId;
    if (node) {
        const childGroups = new Set<string>();
        traverseDown(
            childGroups,
            new Set<string>(),
            state.document.columns,
            node,
        );
        state.state.draggedBranch.node = action.payload.nodeId;
        state.state.draggedBranch.childGroups = childGroups;
    }
};
