import { PinnedNodesState } from 'src/stores/document/document-state-type';

export type UnpinNodeAction = {
    type: 'document/pinned-nodes/unpin';
    payload: {
        id: string;
    };
};

export const unpinNode = (pinnedNodes: PinnedNodesState, id: string) => {
    pinnedNodes.Ids = pinnedNodes.Ids.filter((_id) => _id !== id);
    // Clean up category mapping when unpinning
    delete pinnedNodes.nodeToCategory[id];
};
