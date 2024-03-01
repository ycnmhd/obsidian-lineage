import { DocumentInstance } from 'src/stores/document/document-type';

export const updateEditingNodeOnActiveNodeChange = (
    state: DocumentInstance,
    nodeId: string,
    newNode = false,
) => {
    state.state.editing.savePreviousNode = true;
    if (newNode) {
        state.state.editing.activeNodeId = nodeId;
    } else if (state.state.editing.activeNodeId !== nodeId) {
        state.state.editing.activeNodeId = '';
    }
};
