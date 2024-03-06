import {
    DocumentInstanceState,
    TreeState,
} from 'src/stores/view/view-state-type';

export type ToggleEditModeAction = {
    type: 'DOCUMENT/ENABLE_EDIT_MODE';
};
export const enableEditMode = (
    documentState: DocumentInstanceState,
    treeState: TreeState,
) => {
    const activeNodeId = documentState.activeNode;
    if (!activeNodeId) return;
    treeState.editing.activeNodeId = activeNodeId;
};
