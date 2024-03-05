import { traverseDown } from 'src/stores/view/helpers/search/traverse-down';
import { Column, DNDState, NodeId } from 'src/stores/view/view-state-type';

export type SetDragStartedAction = {
    type: 'SET_DRAG_STARTED';
    payload: {
        nodeId: string;
    };
};
export const onDragStart = (
    columns: Column[],
    state: DNDState,
    action: SetDragStartedAction,
) => {
    const node = action.payload.nodeId;
    if (node) {
        const childGroups: NodeId[] = [];
        traverseDown(childGroups, columns, node);
        state.node = action.payload.nodeId;
        state.childGroups = new Set(childGroups);
    }
};