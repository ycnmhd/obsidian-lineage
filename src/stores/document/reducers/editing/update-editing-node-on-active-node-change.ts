import { DocumentInstanceState } from 'src/stores/document/document-type';

export const updateEditingNodeOnActiveNodeChange = (
    state: DocumentInstanceState,
    nodeId: string,
    newNode = false,
) => {
    state.editing.savePreviousNode = true;
    if (newNode) {
        state.editing.activeNodeId = nodeId;
    } else if (state.editing.activeNodeId !== nodeId) {
        state.editing.activeNodeId = '';
    }
};
