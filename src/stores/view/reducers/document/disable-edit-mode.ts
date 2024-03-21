import { ViewState } from 'src/stores/view/view-state-type';

export type DisableEditModeAction = {
    type: 'DOCUMENT/DISABLE_EDIT_MODE';
};
export const disableEditMode = (editing: ViewState['document']['editing']) => {
    editing.activeNodeId = '';
};
