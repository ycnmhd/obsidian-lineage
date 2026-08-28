import { PinnedNodesState } from 'src/stores/document/document-state-type';

export type AddCategoryAction = {
    type: 'document/pinned-nodes/add-category';
    payload: {
        name: string;
    };
};

export const addCategory = (
    pinnedNodes: PinnedNodesState,
    name: string,
) => {
    if (!pinnedNodes.fileCategories.includes(name)) {
        pinnedNodes.fileCategories.push(name);
    }
};
