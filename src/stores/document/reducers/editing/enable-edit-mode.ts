import { DocumentInstanceState } from 'src/stores/document/document-type';

export type ToggleEditModeAction = {
    type: 'ENABLE_EDIT_MODE';
};
export const enableEditMode = (state: DocumentInstanceState) => {
    const activeNodeId = state.activeBranch.node;
    if (!activeNodeId) return;
    state.editing.savePreviousNode = false;
    state.editing.activeNodeId = activeNodeId;
};
