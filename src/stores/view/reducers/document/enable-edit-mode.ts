import { ViewState } from 'src/stores/view/view-state-type';

export type ToggleEditModeAction = {
    type: 'DOCUMENT/ENABLE_EDIT_MODE';
    payload: {
        nodeId: string;
    };
};
export const enableEditMode = (
    editing: ViewState['document']['editing'],
    action: ToggleEditModeAction,
) => {
    editing.activeNodeId = action.payload.nodeId;
};
