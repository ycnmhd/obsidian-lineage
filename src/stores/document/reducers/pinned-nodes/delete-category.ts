import { PinnedNodesState } from 'src/stores/document/document-state-type';

export type DeleteCategoryAction = {
    type: 'document/pinned-nodes/delete-category';
    payload: {
        name: string;
    };
};

export const deleteCategory = (
    pinnedNodes: PinnedNodesState,
    name: string,
) => {
    // Remove category from fileCategories
    pinnedNodes.fileCategories = pinnedNodes.fileCategories.filter(
        (c) => c !== name,
    );
    // Unassign all nodes from this category
    for (const [nodeId, category] of Object.entries(pinnedNodes.nodeToCategory)) {
        if (category === name) {
            delete pinnedNodes.nodeToCategory[nodeId];
        }
    }
};
