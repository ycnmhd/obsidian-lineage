import Lineage from 'src/main';
import {
    GlobalCategoryNode,
    GlobalCategoryType,
} from 'src/stores/settings/types/global-categories-types';

/**
 * Create a global-category tree node (folder or category) and return the id
 * of the freshly created node. The reducer runs synchronously on `dispatch`
 * and always appends the new node as the last child of its parent, so we can
 * reliably re-read the tree afterwards and pick the matching trailing node.
 */
export const createNodeAndGetId = (
    plugin: Lineage,
    name: string,
    type: GlobalCategoryType,
    parentId: string | null,
): string | null => {
    plugin.settings.dispatch({
        type:
            type === 'folder'
                ? 'settings/categories/global/create-folder'
                : 'settings/categories/global/create-category',
        payload: { parentId, name },
    });

    const tree = plugin.settings.getValue().categories.tree;
    const siblings = parentId === null ? tree : findNode(tree, parentId)?.children;
    if (!siblings) return null;

    // find the last sibling matching this type + name (the node just created)
    for (let i = siblings.length - 1; i >= 0; i--) {
        const node = siblings[i];
        if (node.type === type && node.name === name) return node.id;
    }
    return null;
};

const findNode = (
    nodes: GlobalCategoryNode[],
    id: string,
): GlobalCategoryNode | null => {
    for (const node of nodes) {
        if (node.id === id) return node;
        const found = findNode(node.children, id);
        if (found) return found;
    }
    return null;
};
