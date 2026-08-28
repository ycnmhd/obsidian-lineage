import { describe, expect, it } from 'vitest';
import { get } from 'svelte/store';
import type { LineageView } from 'src/view/view';
import { FilteredPinnedNodesStore } from 'src/stores/document/derived/filtered-pinned-nodes-store';
import { GlobalCategoryNode } from 'src/stores/settings/types/global-categories-types';

const node = (
    id: string,
    name: string,
    type: 'folder' | 'category',
    parentId: string | null,
): GlobalCategoryNode => ({ id, name, type, parentId, children: [] });

const fakeStore = <T>(value: T) => ({
    getValue: () => value,
    subscribe: (fn: (v: T) => void) => {
        fn(value);
        return () => {};
    },
});

const makeStore = (globalCategoriesEnabled: boolean) => {
    const davidson = node('gc1', 'Davidson', 'folder', null);
    const similarity = node('gc2', 'similarity responses', 'category', 'gc1');
    davidson.children = [similarity];

    const pinnedState = {
        Ids: ['n1', 'n2'],
        nodeToCategory: { n1: 'global:gc2', n2: 'local-cat' },
        fileCategories: ['local-cat'],
    };
    const viewState = { pinnedNodes: { activeCategory: 'all' } };
    const settingsState = {
        categories: {
            tree: [davidson],
            globalCards: {},
            globalCategoriesEnabled,
        },
    };

    const view = {
        documentStore: fakeStore({ pinnedNodes: pinnedState }),
        viewStore: fakeStore(viewState),
        plugin: { settings: fakeStore(settingsState) },
    } as unknown as LineageView;

    return FilteredPinnedNodesStore(view);
};

describe('FilteredPinnedNodesStore — global categories toggle', () => {
    it('offers global categories as filters when enabled', () => {
        const store = makeStore(true);
        const state = get(store);
        expect(state.categories).toContain('Davidson / similarity responses');
        expect(state.categories).toContain('local-cat');
        expect(state.globalEntries).toHaveLength(1);
    });

    it('hides global categories from the sidebar filters when disabled', () => {
        const store = makeStore(false);
        const state = get(store);
        expect(state.categories).not.toContain(
            'Davidson / similarity responses',
        );
        expect(state.categories).toEqual(['local-cat']);
        expect(state.globalEntries).toEqual([]);
    });
});
