import { describe, expect, it } from 'vitest';
import {
    addGlobalCard,
    createGlobalNode,
    deleteGlobalNode,
    findNode,
    moveGlobalCard,
    moveGlobalNode,
    removeGlobalCard,
    renameGlobalNode,
} from 'src/stores/settings/reducers/global-categories/global-categories-reducer';
import { GlobalCategories } from 'src/stores/settings/types/global-categories-types';

const emptyCategories = (): GlobalCategories => ({
    tree: [],
    globalCards: {},
    globalCategoriesEnabled: true,
});

const buildFixture = () => {
    const categories = emptyCategories();
    const davidson = createGlobalNode(categories, null, 'Davidson', 'folder')!;
    const similarity = createGlobalNode(
        categories,
        davidson.id,
        'similarity responses',
        'category',
    )!;
    const radical = createGlobalNode(
        categories,
        davidson.id,
        'radical interpretation',
        'category',
    )!;
    const quine = createGlobalNode(categories, null, 'Quine', 'folder')!;
    const similarity2 = createGlobalNode(
        categories,
        quine.id,
        'similarity responses',
        'category',
    )!;
    return { categories, davidson, similarity, radical, quine, similarity2 };
};

describe('createGlobalNode', () => {
    it('creates a root node when parentId is null', () => {
        const { categories } = buildFixture();
        expect(categories.tree.map((n) => n.name)).toEqual([
            'Davidson',
            'Quine',
        ]);
    });

    it('creates a child inside a folder', () => {
        const { categories, davidson } = buildFixture();
        const child = createGlobalNode(
            categories,
            davidson.id,
            'anomalous monism',
            'category',
        )!;
        expect(child.parentId).toBe(davidson.id);
        expect(davidson.children.map((n) => n.name)).toContain(
            'anomalous monism',
        );
    });

    it('allows duplicate names in different folders', () => {
        const { categories, quine } = buildFixture();
        expect(categories.tree.filter((n) => n.name === 'Quine')).toHaveLength(1);
        const dupe = createGlobalNode(
            categories,
            quine.id,
            'similarity responses',
            'category',
        )!;
        expect(dupe.name).toBe('similarity responses');
        const categoriesNamed = categories.tree.flatMap((n) => [
            n,
            ...n.children,
        ]);
        expect(
            categoriesNamed.filter((n) => n.name === 'similarity responses'),
        ).toHaveLength(3);
    });

    it('refuses to create a child in a category (leaf)', () => {
        const { categories, similarity } = buildFixture();
        const result = createGlobalNode(
            categories,
            similarity.id,
            'nested',
            'category',
        );
        expect(result).toBeNull();
    });
});

describe('renameGlobalNode', () => {
    it('renames a node', () => {
        const { categories, similarity } = buildFixture();
        expect(renameGlobalNode(categories, similarity.id, 'similarity!')).toBe(
            true,
        );
        expect(similarity.name).toBe('similarity!');
    });

    it('returns false for a missing node', () => {
        const { categories } = buildFixture();
        expect(renameGlobalNode(categories, 'nope', 'x')).toBe(false);
    });
});

describe('deleteGlobalNode', () => {
    it('deletes a subtree and its cards', () => {
        const { categories, davidson, similarity, radical } = buildFixture();
        addGlobalCard(categories, similarity.id, 'a.md', '1.2');
        addGlobalCard(categories, radical.id, 'b.md', '2.1');

        expect(deleteGlobalNode(categories, davidson.id)).toBe(true);
        expect(findNode(categories.tree, davidson.id)).toBeNull();
        expect(findNode(categories.tree, similarity.id)).toBeNull();
        expect(categories.globalCards[similarity.id]).toBeUndefined();
        expect(categories.globalCards[radical.id]).toBeUndefined();
        expect(categories.tree.map((n) => n.name)).toEqual(['Quine']);
    });

    it('returns false for a missing node', () => {
        const { categories } = buildFixture();
        expect(deleteGlobalNode(categories, 'nope')).toBe(false);
    });
});

describe('moveGlobalNode', () => {
    it('moves a node into another folder', () => {
        const { categories, similarity, quine } = buildFixture();
        expect(moveGlobalNode(categories, similarity.id, quine.id)).toBe(true);
        expect(findNode(quine.children, similarity.id)).not.toBeNull();
        expect(
            categories.tree
                .find((n) => n.name === 'Davidson')!
                .children.some((c) => c.id === similarity.id),
        ).toBe(false);
    });

    it('moves a node to the root', () => {
        const { categories, similarity } = buildFixture();
        expect(moveGlobalNode(categories, similarity.id, null)).toBe(true);
        expect(categories.tree.some((n) => n.id === similarity.id)).toBe(true);
    });

    it('refuses to move a node into itself or a descendant', () => {
        const { categories, davidson, similarity } = buildFixture();
        expect(moveGlobalNode(categories, davidson.id, davidson.id)).toBe(false);
        expect(moveGlobalNode(categories, davidson.id, similarity.id)).toBe(
            false,
        );
    });

    it('respects an explicit index for reordering', () => {
        const { categories, similarity2 } = buildFixture();
        const top = createGlobalNode(categories, null, 'Top', 'category')!;
        expect(
            moveGlobalNode(categories, similarity2.id, null, 0),
        ).toBe(true);
        expect(categories.tree[0].id).toBe(similarity2.id);
        expect(categories.tree[3].id).toBe(top.id);
    });
});

describe('global cards', () => {
    it('adds a card and dedupes', () => {
        const { categories, similarity } = buildFixture();
        expect(addGlobalCard(categories, similarity.id, 'a.md', '1.2')).toBe(
            true,
        );
        expect(addGlobalCard(categories, similarity.id, 'a.md', '1.2')).toBe(
            false,
        );
        expect(categories.globalCards[similarity.id]).toHaveLength(1);
    });

    it('refuses to add a card to a folder', () => {
        const { categories, davidson } = buildFixture();
        expect(addGlobalCard(categories, davidson.id, 'a.md', '1.2')).toBe(
            false,
        );
    });

    it('removes a card', () => {
        const { categories, similarity } = buildFixture();
        addGlobalCard(categories, similarity.id, 'a.md', '1.2');
        addGlobalCard(categories, similarity.id, 'b.md', '2.1');
        expect(
            removeGlobalCard(categories, similarity.id, 'a.md', '1.2'),
        ).toBe(true);
        expect(categories.globalCards[similarity.id]).toHaveLength(1);
        expect(removeGlobalCard(categories, similarity.id, 'a.md', '1.2')).toBe(
            false,
        );
    });

    it('moves a card to a new index', () => {
        const { categories, similarity } = buildFixture();
        addGlobalCard(categories, similarity.id, 'a.md', '1.2');
        addGlobalCard(categories, similarity.id, 'b.md', '2.1');
        addGlobalCard(categories, similarity.id, 'c.md', '3.1');
        expect(
            moveGlobalCard(categories, similarity.id, 'c.md', '3.1', 0),
        ).toBe(true);
        expect(categories.globalCards[similarity.id].map((c) => c.section)).toEqual([
            '3.1',
            '1.2',
            '2.1',
        ]);
    });
});
