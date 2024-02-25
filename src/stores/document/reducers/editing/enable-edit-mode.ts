import { DocumentState } from 'src/stores/document/document-reducer';

export type ToggleEditModeAction = {
    type: 'ENABLE_EDIT_MODE';
};
export const enableEditMode = (state: DocumentState) => {
    const activeNodeId = state.state.activeBranch.node;
    if (!activeNodeId) return;
    state.state.editing.savePreviousNode = false;
    state.state.editing.activeNodeId = activeNodeId;
};
