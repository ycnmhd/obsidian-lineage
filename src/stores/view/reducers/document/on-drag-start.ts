import { DNDState } from 'src/stores/view/default-view-state';

export type SetDragStartedAction = {
    type: 'SET_DRAG_STARTED';
    payload: {
        nodeId: string;
        childGroups: string[];
    };
};
export const onDragStart = (state: DNDState, action: SetDragStartedAction) => {
    const node = action.payload.nodeId;
    if (node) {
        state.node = action.payload.nodeId;
        state.childGroups = new Set(action.payload.childGroups);
    }
};
