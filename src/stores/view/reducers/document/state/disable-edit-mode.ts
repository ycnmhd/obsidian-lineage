import { DocumentInstanceState } from 'src/stores/view/view-state-type';

export type DisableEditModeAction = {
    type: 'DOCUMENT/DISABLE_EDIT_MODE';
};
export const disableEditMode = (
    state: DocumentInstanceState,
    action: DisableEditModeAction,
) => {
    if (!state.editing.activeNodeId) return;
    state.editing.activeNodeId = '';
};
