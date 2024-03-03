import { DocumentInstanceState } from 'src/stores/document/document-type';

export type DisableEditModeAction = {
    type: 'DISABLE_EDIT_MODE';
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
