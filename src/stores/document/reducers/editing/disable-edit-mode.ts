import { DocumentState } from 'src/stores/document/document-reducer';

export type DisableEditModeAction = {
    type: 'DISABLE_EDIT_MODE';
    payload: { save: boolean };
};
export const disableEditMode = (
    state: DocumentState,
    action: DisableEditModeAction,
) => {
    if (!state.state.editing.activeNodeId) return;
    state.state.editing.savePreviousNode = action.payload.save;
    state.state.editing.activeNodeId = '';
};
