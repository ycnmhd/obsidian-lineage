import { get } from 'svelte/store';
import { ViewStore } from 'src/view/view';
import { DocumentSearch } from 'src/stores/view/subscriptions/effects/document-search/document-search';
import { globalVirtualViewsStore } from './global-view-keyboard';

/**
 * Reuses the main view's `DocumentSearch` (fuse.js over each file's document
 * content) to search across every file that currently mounts cards in the
 * global categories view, then writes the combined results into the shared
 * view store (`state.search.results`).
 *
 * The shared view store already holds the search state (`query`,
 * `showInput`, `fuzzySearch`, `showAllNodes`, `results`) and the
 * `view/search/*` reducers, so the global view only has to supply the result
 * set — the same filtering semantics as the main lineage view applies.
 */

// Cache one DocumentSearch per mounted virtual view so the fuse index
// persists across keystrokes (mirrors the main view's lazy-rebuild behaviour).
const viewToSearch = new WeakMap<object, DocumentSearch>();
const cachedSearches = new Set<DocumentSearch>();

export const resetGlobalSearchIndexes = () => {
    for (const search of cachedSearches) {
        search.resetIndex();
    }
};

let lastFuzzy: boolean | null = null;

export const updateGlobalSearchResults = (viewStore: ViewStore) => {
    const state = viewStore.getValue();
    const query = state.search.query;
    const results = new Map();

    // Fuzzy mode toggling needs a rebuilt index (same as `view/documentSearch.resetIndex()`).
    if (state.search.fuzzySearch !== lastFuzzy) {
        resetGlobalSearchIndexes();
        lastFuzzy = state.search.fuzzySearch;
    }

    if (!query) {
        viewStore.dispatch({
            type: 'view/search/set-results',
            payload: { results },
        });
        return;
    }

    for (const view of Object.values(get(globalVirtualViewsStore))) {
        if (!view.documentStore) continue;
        let search = viewToSearch.get(view);
        if (!search) {
            search = new DocumentSearch(view as never);
            viewToSearch.set(view, search);
            cachedSearches.add(search);
        }
        const fileResults = search.search(query);
        for (const [id, result] of fileResults) {
            results.set(id, result);
        }
    }

    viewStore.dispatch({
        type: 'view/search/set-results',
        payload: { results },
    });
};
