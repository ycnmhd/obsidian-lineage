import { DocumentInstanceState } from 'src/stores/view/view-state-type';

export const updateActiveNode = (
    state: DocumentInstanceState,
    nodeId: string,
) => {
    state.activeNode = nodeId;
};
