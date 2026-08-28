import { id } from 'src/helpers/id';
import {
    GlobalCategories,
    GlobalCategoryNode,
    GlobalCategoryType,
} from 'src/stores/settings/types/global-categories-types';

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

const getParentNodes = (
    categories: GlobalCategories,
    parentId: string | null,
): GlobalCategoryNode[] | null => {
    if (parentId === null) return categories.tree;
    const parent = findNode(categories.tree, parentId);
    if (!parent || parent.type !== 'folder') return null;
    return parent.children;
};

export const createGlobalNode = (
    categories: GlobalCategories,
    parentId: string | null,
    name: string,
    type: GlobalCategoryType,
): GlobalCategoryNode | null => {
    const parentNodes = getParentNodes(categories, parentId);
    if (!parentNodes) return null;
    const node: GlobalCategoryNode = {
        id: id.globalCategory(),
        name,
        type,
        parentId,
        children: [],
    };
    parentNodes.push(node);
    return node;
};

export const renameGlobalNode = (
    categories: GlobalCategories,
    nodeId: string,
    name: string,
): boolean => {
    const node = findNode(categories.tree, nodeId);
    if (!node) return false;
    node.name = name;
    return true;
};

const removeNodeFrom = (
    nodes: GlobalCategoryNode[],
    nodeId: string,
): GlobalCategoryNode | null => {
    const index = nodes.findIndex((n) => n.id === nodeId);
    if (index !== -1) return nodes.splice(index, 1)[0];
    for (const node of nodes) {
        const removed = removeNodeFrom(node.children, nodeId);
        if (removed) return removed;
    }
    return null;
};

const collectSubtreeIds = (node: GlobalCategoryNode): string[] => {
    const ids = [node.id];
    for (const child of node.children) ids.push(...collectSubtreeIds(child));
    return ids;
};

export const deleteGlobalNode = (
    categories: GlobalCategories,
    nodeId: string,
): boolean => {
    const removed = removeNodeFrom(categories.tree, nodeId);
    if (!removed) return false;
    // remove cards held by every category in the deleted subtree
    for (const removedId of collectSubtreeIds(removed)) {
        delete categories.globalCards[removedId];
    }
    return true;
};

export const moveGlobalNode = (
    categories: GlobalCategories,
    nodeId: string,
    newParentId: string | null,
    index?: number,
): boolean => {
    const node = findNode(categories.tree, nodeId);
    if (!node) return false;
    // a node cannot be moved into itself or one of its descendants
    if (newParentId !== null) {
        if (newParentId === nodeId) return false;
        if (findNode(node.children, newParentId)) return false;
    }
    const parentNodes = getParentNodes(categories, newParentId);
    if (!parentNodes) return false;

    removeNodeFrom(categories.tree, nodeId);
    node.parentId = newParentId;
    if (typeof index === 'number' && index >= 0 && index <= parentNodes.length) {
        parentNodes.splice(index, 0, node);
    } else {
        parentNodes.push(node);
    }
    return true;
};

const normalizeCard = (filePath: string, section: string) => ({
    filePath,
    section,
});

const cardKey = (filePath: string, section: string) =>
    `${filePath}\u0000${section}`;

export const addGlobalCard = (
    categories: GlobalCategories,
    categoryId: string,
    filePath: string,
    section: string,
): boolean => {
    const node = findNode(categories.tree, categoryId);
    if (!node || node.type !== 'category') return false;
    if (!categories.globalCards[categoryId]) categories.globalCards[categoryId] = [];
    const cards = categories.globalCards[categoryId];
    const exists = cards.some(
        (c) => cardKey(c.filePath, c.section) === cardKey(filePath, section),
    );
    if (exists) return false;
    cards.push(normalizeCard(filePath, section));
    return true;
};

export const removeGlobalCard = (
    categories: GlobalCategories,
    categoryId: string,
    filePath: string,
    section: string,
): boolean => {
    const cards = categories.globalCards[categoryId];
    if (!cards) return false;
    const before = cards.length;
    categories.globalCards[categoryId] = cards.filter(
        (c) => cardKey(c.filePath, c.section) !== cardKey(filePath, section),
    );
    return categories.globalCards[categoryId].length !== before;
};

export const setGlobalCategoriesEnabled = (
    categories: GlobalCategories,
    enabled: boolean,
) => {
    categories.globalCategoriesEnabled = enabled;
};

export const moveGlobalCard = (
    categories: GlobalCategories,
    categoryId: string,
    filePath: string,
    section: string,
    toIndex: number,
): boolean => {
    const cards = categories.globalCards[categoryId];
    if (!cards) return false;
    const key = cardKey(filePath, section);
    const fromIndex = cards.findIndex(
        (c) => cardKey(c.filePath, c.section) === key,
    );
    if (fromIndex === -1) return false;
    const [card] = cards.splice(fromIndex, 1);
    const target =
        typeof toIndex === 'number' && toIndex >= 0 && toIndex <= cards.length
            ? toIndex
            : cards.length;
    cards.splice(target, 0, card);
    return true;
};
