import { TreeState } from 'src/stores/view/view-state-type';

export type DisableEditModeAction = {
    type: 'DOCUMENT/DISABLE_EDIT_MODE';
};
export const disableEditMode = (state: TreeState) => {
    if (!state.editing.activeNodeId) return;
    state.editing.activeNodeId = '';
};
