import { DocumentInstanceState } from 'src/stores/view/view-state-type';

export type DisableEditModeAction = {
    type: 'DOCUMENT/DISABLE_EDIT_MODE';
    payload: { save: boolean };
};
export const disableEditMode = (
    state: DocumentInstanceState,
    action: DisableEditModeAction,
) => {
    if (!state.editing.activeNodeId) return;
    state.editing.savePreviousNode = action.payload.save;
    state.editing.activeNodeId = '';
};
