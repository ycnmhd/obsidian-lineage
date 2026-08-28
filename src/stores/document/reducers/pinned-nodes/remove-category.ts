import { PinnedNodesState } from 'src/stores/document/document-state-type';

export type RemoveCategoryAction = {
    type: 'document/pinned-nodes/remove-category';
    payload: {
        id: string;
    };
};

export const removeCategory = (pinnedNodes: PinnedNodesState, id: string) => {
    delete pinnedNodes.nodeToCategory[id];
};
