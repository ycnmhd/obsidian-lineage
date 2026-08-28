import { describe, expect, it } from 'vitest';
import {
    aggregateCards,
    aggregateCardsForSelection,
    aggregateCardsWithCategory,
    collectCategoryIdsInSubtree,
    findNode,
    flattenTree,
    getCategoryEntries,
    getCategoriesForCard,
    getDisplayPath,
    getParentNodes,
} from 'src/view/components/global-categories/helpers/tree-utils';
import {
    GlobalCategories,
    GlobalCategoryNode,
} from 'src/stores/settings/types/global-categories-types';

const node = (
    id: string,
    name: string,
    type: 'folder' | 'category',
    parentId: string | null,
): GlobalCategoryNode => ({
    id,
    name,
    type,
    parentId,
    children: [],
});

const buildFixture = (): GlobalCategories => {
    const categories: GlobalCategories = {
        tree: [],
        globalCards: {},
        globalCategoriesEnabled: true,
    };
    const davidson = node('gc1', 'Davidson', 'folder', null);
    const similarity = node('gc2', 'similarity responses', 'category', 'gc1');
    const radical = node('gc3', 'radical interpretation', 'category', 'gc1');
    const quine = node('gc4', 'Quine', 'folder', null);
    const similarity2 = node('gc5', 'similarity responses', 'category', 'gc4');
    davidson.children = [similarity, radical];
    quine.children = [similarity2];
    categories.tree = [davidson, quine];
    categories.globalCards = {
        gc2: [
            { filePath: 'a.md', section: '1.2' },
            { filePath: 'b.md', section: '2.1' },
        ],
        gc3: [{ filePath: 'c.md', section: '3.1' }],
        gc5: [{ filePath: 'd.md', section: '1.1' }],
    };
    return categories;
};

describe('findNode / flattenTree / getParentNodes', () => {
    it('finds nodes at any depth', () => {
        const categories = buildFixture();
        expect(findNode(categories.tree, 'gc2')?.name).toBe(
            'similarity responses',
        );
        expect(findNode(categories.tree, 'nope')).toBeNull();
    });

    it('flattens the tree breadth-first', () => {
        const categories = buildFixture();
        expect(flattenTree(categories.tree).map((n) => n.id)).toEqual([
            'gc1',
            'gc2',
            'gc3',
            'gc4',
            'gc5',
        ]);
    });

    it('returns the correct sibling array', () => {
        const categories = buildFixture();
        expect(
            getParentNodes(categories.tree, 'gc1')?.map((n) => n.id),
        ).toEqual(['gc2', 'gc3']);
        expect(getParentNodes(categories.tree, null)).toBe(categories.tree);
        expect(getParentNodes(categories.tree, 'gc2')).toBeNull();
    });
});

describe('collectCategoryIdsInSubtree', () => {
    it('returns only its own id for a category', () => {
        const categories = buildFixture();
        expect(
            collectCategoryIdsInSubtree(findNode(categories.tree, 'gc2')!),
        ).toEqual(['gc2']);
    });

    it('returns all descendant category ids for a folder', () => {
        const categories = buildFixture();
        expect(
            collectCategoryIdsInSubtree(findNode(categories.tree, 'gc1')!),
        ).toEqual(['gc2', 'gc3']);
    });
});

describe('aggregateCards (Option C)', () => {
    it('shows only its own cards for a category', () => {
        const categories = buildFixture();
        const cards = aggregateCards(categories, 'gc2');
        expect(cards).toEqual([
            { filePath: 'a.md', section: '1.2' },
            { filePath: 'b.md', section: '2.1' },
        ]);
    });

    it('aggregates cards of all descendant categories for a folder', () => {
        const categories = buildFixture();
        const cards = aggregateCards(categories, 'gc1');
        expect(cards).toHaveLength(3);
        expect(cards.map((c) => c.filePath)).toEqual(['a.md', 'b.md', 'c.md']);
    });

    it('returns [] for an unknown node', () => {
        const categories = buildFixture();
        expect(aggregateCards(categories, 'nope')).toEqual([]);
    });
});

describe('aggregateCardsWithCategory', () => {
    it('keeps the owning category id of each card', () => {
        const categories = buildFixture();
        const cards = aggregateCardsWithCategory(categories, 'gc1');
        expect(cards).toEqual([
            { categoryId: 'gc2', filePath: 'a.md', section: '1.2' },
            { categoryId: 'gc2', filePath: 'b.md', section: '2.1' },
            { categoryId: 'gc3', filePath: 'c.md', section: '3.1' },
        ]);
    });
});

describe('aggregateCardsForSelection (folder + category selectors)', () => {
    it("category selection → only that category's cards", () => {
        const categories = buildFixture();
        expect(aggregateCardsForSelection(categories, 'gc1', 'gc3')).toEqual([
            { categoryId: 'gc3', filePath: 'c.md', section: '3.1' },
        ]);
    });

    it('folder selection → cards of all categories beneath it', () => {
        const categories = buildFixture();
        expect(aggregateCardsForSelection(categories, 'gc4', null)).toEqual([
            { categoryId: 'gc5', filePath: 'd.md', section: '1.1' },
        ]);
    });

    it('no selection → cards of every category', () => {
        const categories = buildFixture();
        const all = aggregateCardsForSelection(categories, null, null);
        expect(all).toHaveLength(4);
        expect(all.map((c) => c.section)).toEqual(['1.2', '2.1', '3.1', '1.1']);
    });
});

describe('getDisplayPath / getCategoryEntries', () => {
    it('builds display paths', () => {
        const categories = buildFixture();
        expect(getDisplayPath(categories.tree, 'gc2')).toBe(
            'Davidson / similarity responses',
        );
        expect(getDisplayPath(categories.tree, 'gc5')).toBe(
            'Quine / similarity responses',
        );
        expect(getDisplayPath(categories.tree, 'nope')).toBe('');
    });

    it('lists only category leaves with their paths (duplicates allowed)', () => {
        const categories = buildFixture();
        expect(getCategoryEntries(categories.tree)).toEqual([
            { id: 'gc2', path: 'Davidson / similarity responses' },
            { id: 'gc3', path: 'Davidson / radical interpretation' },
            { id: 'gc5', path: 'Quine / similarity responses' },
        ]);
    });
});

describe('getCategoriesForCard', () => {
    it('finds every category a card belongs to (with display paths)', () => {
        const categories = buildFixture();
        expect(getCategoriesForCard(categories, 'a.md', '1.2')).toEqual([
            { id: 'gc2', path: 'Davidson / similarity responses' },
        ]);
        expect(getCategoriesForCard(categories, 'nope.md', '1.2')).toEqual([]);
    });

    it('a card in multiple categories lists all of them', () => {
        const categories = buildFixture();
        categories.globalCards.gc5 = [
            ...(categories.globalCards.gc5 ?? []),
            { filePath: 'a.md', section: '1.2' },
        ];
        expect(getCategoriesForCard(categories, 'a.md', '1.2')).toEqual([
            { id: 'gc2', path: 'Davidson / similarity responses' },
            { id: 'gc5', path: 'Quine / similarity responses' },
        ]);
    });
});
