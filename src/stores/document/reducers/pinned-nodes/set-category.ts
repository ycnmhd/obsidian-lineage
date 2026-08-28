import { PinnedNodesState } from 'src/stores/document/document-state-type';
import { isGlobalCategoryValue } from 'src/stores/settings/types/global-categories-types';

export type SetCategoryAction = {
    type: 'document/pinned-nodes/set-category';
    payload: {
        id: string;
        category: string;
    };
};

export const setCategory = (
    pinnedNodes: PinnedNodesState,
    id: string,
    category: string,
) => {
    pinnedNodes.nodeToCategory[id] = category;
    // Global category values are namespaced (`global:<id>`) and must never
    // be added to the file-specific category list
    if (
        !isGlobalCategoryValue(category) &&
        pinnedNodes.fileCategories &&
        !pinnedNodes.fileCategories.includes(category)
    ) {
        pinnedNodes.fileCategories.push(category);
    }
};
