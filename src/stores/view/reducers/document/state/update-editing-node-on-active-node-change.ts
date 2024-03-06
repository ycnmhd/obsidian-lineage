import { TreeState } from 'src/stores/view/view-state-type';

export const updateEditingNodeOnActiveNodeChange = (
    state: TreeState,
    nodeId: string,
    newNode = false,
) => {
    if (newNode) {
        state.editing.activeNodeId = nodeId;
    } else if (state.editing.activeNodeId !== nodeId) {
        state.editing.activeNodeId = '';
    }
};
