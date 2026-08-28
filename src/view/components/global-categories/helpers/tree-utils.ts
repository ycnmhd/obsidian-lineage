import {
    GlobalCardRef,
    GlobalCategories,
    GlobalCategoryNode,
} from 'src/stores/settings/types/global-categories-types';

/** Find a node anywhere in the tree by id. */
export const findNode = (
    nodes: GlobalCategoryNode[],
    nodeId: string,
): GlobalCategoryNode | null => {
    for (const node of nodes) {
        if (node.id === nodeId) return node;
        const found = findNode(node.children, nodeId);
        if (found) return found;
    }
    return null;
};

/** The array that holds the children of a parent id (or the root array). */
export const getParentNodes = (
    tree: GlobalCategoryNode[],
    parentId: string | null,
): GlobalCategoryNode[] | null => {
    if (parentId === null) return tree;
    const parent = findNode(tree, parentId);
    if (!parent || parent.type !== 'folder') return null;
    return parent.children;
};

/** Flat list of all nodes (breadth-first). */
export const flattenTree = (
    nodes: GlobalCategoryNode[],
): GlobalCategoryNode[] => {
    const result: GlobalCategoryNode[] = [];
    for (const node of nodes) {
        result.push(node);
        result.push(...flattenTree(node.children));
    }
    return result;
};

/** All descendant category ids of a node (or the node itself if it's a category). */
export const collectCategoryIdsInSubtree = (
    node: GlobalCategoryNode,
): string[] => {
    if (node.type === 'category') return [node.id];
    return node.children.flatMap(collectCategoryIdsInSubtree);
};

/**
 * Aggregate cards for a selected node (Option C):
 * a folder shows every card from all categories beneath it; a category shows
 * only its own cards.
 */
export const aggregateCards = (
    categories: GlobalCategories,
    nodeId: string,
): GlobalCardRef[] => {
    const node = findNode(categories.tree, nodeId);
    if (!node) return [];
    const ids = collectCategoryIdsInSubtree(node);
    const cards: GlobalCardRef[] = [];
    for (const id of ids) {
        cards.push(...(categories.globalCards[id] ?? []));
    }
    return cards;
};

export type ResolvedGlobalCard = {
    categoryId: string;
    filePath: string;
    section: string;
};

/** Like `aggregateCards` but keeps the owning category id of every card. */
export const aggregateCardsWithCategory = (
    categories: GlobalCategories,
    nodeId: string,
): ResolvedGlobalCard[] => {
    const node = findNode(categories.tree, nodeId);
    if (!node) return [];
    const ids = collectCategoryIdsInSubtree(node);
    const cards: ResolvedGlobalCard[] = [];
    for (const id of ids) {
        for (const card of categories.globalCards[id] ?? []) {
            cards.push({
                categoryId: id,
                filePath: card.filePath,
                section: card.section,
            });
        }
    }
    return cards;
};

/**
 * Aggregate cards for a folder + category selection (used by the global view
 * selectors):
 * - category selected → only that category's cards;
 * - only a folder selected → cards of all categories beneath it;
 * - nothing selected → cards of every category.
 */
export const aggregateCardsForSelection = (
    categories: GlobalCategories,
    folderId: string | null,
    categoryId: string | null,
): ResolvedGlobalCard[] => {
    if (categoryId) {
        const node = findNode(categories.tree, categoryId);
        if (!node || node.type !== 'category') return [];
        return aggregateCardsWithCategory(categories, node.id);
    }
    if (folderId) {
        const node = findNode(categories.tree, folderId);
        if (!node || node.type !== 'folder') return [];
        return aggregateCardsWithCategory(categories, node.id);
    }
    const cards: ResolvedGlobalCard[] = [];
    for (const node of flattenTree(categories.tree)) {
        if (node.type !== 'category') continue;
        for (const card of categories.globalCards[node.id] ?? []) {
            cards.push({
                categoryId: node.id,
                filePath: card.filePath,
                section: card.section,
            });
        }
    }
    return cards;
};

/** Display path of a node, e.g. "Davidson / similarity responses". */
export const getDisplayPath = (
    nodes: GlobalCategoryNode[],
    nodeId: string,
): string => {
    const node = findNode(nodes, nodeId);
    if (!node) return '';
    const parentPath =
        node.parentId === null ? '' : getDisplayPath(nodes, node.parentId);
    return parentPath ? `${parentPath} / ${node.name}` : node.name;
};

export type GlobalCategoryEntry = {
    id: string;
    path: string;
};

/** All category (leaf) nodes with their display paths, for menus/filters. */
export const getCategoryEntries = (
    nodes: GlobalCategoryNode[],
): GlobalCategoryEntry[] =>
    flattenTree(nodes)
        .filter((n) => n.type === 'category')
        .map((n) => ({ id: n.id, path: getDisplayPath(nodes, n.id) }));

/**
 * The global categories (ids + display paths) a given card already belongs
 * to, keyed by its stable (filePath, section) reference.
 */
export const getCategoriesForCard = (
    categories: GlobalCategories,
    filePath: string,
    section: string,
): GlobalCategoryEntry[] => {
    const entries: GlobalCategoryEntry[] = [];
    for (const [categoryId, cards] of Object.entries(categories.globalCards)) {
        if (
            cards.some((c) => c.filePath === filePath && c.section === section)
        ) {
            const path = getDisplayPath(categories.tree, categoryId);
            if (path) entries.push({ id: categoryId, path });
        }
    }
    return entries;
};
