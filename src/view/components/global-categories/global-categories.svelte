<script lang="ts">
    import Lineage from 'src/main';
    import { ChevronDown, ChevronUp } from 'lucide-svelte';
    import { onDestroy, onMount } from 'svelte';
    import GlobalCategoriesTree from './components/tree/global-categories-tree.svelte';
    import GlobalCategoryCards from './components/cards/global-category-cards.svelte';
    import GlobalCategorySelectors from './components/selectors/global-category-selectors.svelte';
    import { GlobalCategories } from 'src/stores/settings/types/global-categories-types';
    import { aggregateCardsForSelection, findNode } from './helpers/tree-utils';
    import { lang } from 'src/lang/lang';
    import { Store } from 'src/lib/store/store';
    import { defaultViewState } from 'src/stores/view/default-view-state';
    import { viewReducer } from 'src/stores/view/view-reducer';
    import { onPluginError } from 'src/lib/store/on-plugin-error';
    import { defaultDocumentState } from 'src/stores/document/default-document-state';
    import { LineageDocument } from 'src/stores/document/document-state-type';
    import { ViewStore } from 'src/view/view';
    import { ViewState } from 'src/stores/view/view-state-type';
    import { ViewStoreAction } from 'src/stores/view/view-store-actions';
    import { WorkspaceLeaf } from 'obsidian';
    import {
        globalCardListStore,
        globalViewStore,
        globalVirtualViewsStore,
    } from './helpers/global-view-keyboard';
    import { globalViewHotkeysAction } from './helpers/global-view-hotkeys-action';
    import {
        scrollToFirstSearchResult,
        jumpToSearchResult,
    } from './helpers/global-view-keyboard';
    import {
        globalRevealRequestStore,
        GlobalRevealRequest,
    } from './helpers/reveal-in-global-view';
    import { delay } from 'src/helpers/delay';
    import { get } from 'svelte/store';
    import { updateGlobalSearchResults } from './helpers/global-document-search';
    import GlobalSearchInput from './components/selectors/gc-search-input.svelte';

    export let plugin: Lineage;
    export let leaf: WorkspaceLeaf;
    export let containerEl: HTMLElement;

    // Shared view store for all virtual card views (mirrors sidebar behaviour:
    // only one card is active / being edited at a time).
    const viewStore: ViewStore = new Store<
        ViewState,
        ViewStoreAction,
        LineageDocument
    >(
        defaultViewState(),
        viewReducer,
        onPluginError,
        defaultDocumentState().document,
    );

    let selectedFolderId: string | null = null;
    let selectedCategoryId: string | null = null;
    // the tree stays available for management but is collapsed by default so
    // huge vaults don't crowd the sidebar
    let showTree = false;
    let categories: GlobalCategories = plugin.settings.getValue().categories;
    let rootEl: HTMLElement;

    const focusRoot = () => {
        if (rootEl && !document.activeElement?.isEqualNode(rootEl)) {
            rootEl.focus({ preventScroll: true });
        }
    };

    /**
     * Select the category owning the revealed card and scroll to the card
     * (resolving its node id from the per-file virtual view, which mounts
     * asynchronously the first time a file appears in this view).
     */
    const applyReveal = async (req: GlobalRevealRequest) => {
        const node = findNode(categories.tree, req.categoryId);
        if (!node || node.type !== 'category') return;
        selectedFolderId = node.parentId;
        selectedCategoryId = node.id;
        focusRoot();

        const deadline = Date.now() + 4000;
        let resolvedNodeId: string | null = null;
        while (Date.now() < deadline && !resolvedNodeId) {
            const view = get(globalVirtualViewsStore)[req.filePath];
            resolvedNodeId =
                view?.documentStore.getValue().sections.section_id[
                    req.section
                ] ?? null;
            if (!resolvedNodeId) await delay(50);
        }
        if (!resolvedNodeId) return;

        viewStore.dispatch({
            type: 'view/pinned-nodes/set-active-node',
            payload: { id: resolvedNodeId },
        });
        viewStore.dispatch({
            type: 'view/recent-nodes/set-active-node',
            payload: { id: resolvedNodeId },
        });

        // wait for the card to be in the DOM (async re-render after the
        // selection change), then scroll it into view
        const scrollDeadline = Date.now() + 4000;
        while (Date.now() < scrollDeadline) {
            const el = rootEl.querySelector(`[id="${resolvedNodeId}"]`);
            if (el) {
                el.scrollIntoView?.({ behavior: 'smooth', block: 'center' });
                return;
            }
            await delay(50);
        }
    };

    onMount(() => {
        globalViewStore.set(viewStore);
        focusRoot();
        // a reveal may have been requested before the view was opened
        const pending = get(globalRevealRequestStore);
        if (pending) {
            globalRevealRequestStore.set(null);
            applyReveal(pending);
        }
    });

    // apply reveal requests made while the view is already mounted
    const unsubscribeReveal = globalRevealRequestStore.subscribe((req) => {
        if (req) {
            globalRevealRequestStore.set(null);
            applyReveal(req);
        }
    });

    // Refocus the container when the active card changes (e.g. after clicking
    // a card) or when an inline edit ends, so keyboard navigation keeps
    // working — but never while a card is being edited (the editor must keep
    // focus).
    let lastActiveNode = '';
    let lastEditing = false;
    const unsubscribeView = viewStore.subscribe((state) => {
        const active =
            state.pinnedNodes.activeNode || state.recentNodes.activeNode;
        const editing = Boolean(state.document.editing.activeNodeId);
        if (active !== lastActiveNode) {
            lastActiveNode = active;
            if (!editing) {
                focusRoot();
            }
        } else if (lastEditing && !editing) {
            // an inline edit just ended (saved/cancelled) → give focus back
            // to the container so navigation hotkeys keep working
            focusRoot();
        }
        lastEditing = editing;
    });

    const unsubscribeSettings = plugin.settings.subscribe((state) => {
        categories = state.categories;
    });

    // Reuse the main view's search: recompute results across the currently
    // mounted files when the query or fuzzy mode changes. NOTE: this must NOT
    // also recompute on card-list changes — dispatching `set-results` (a new
    // Map) would feed back into the card list's reactive rebuild →
    // `globalCardListStore.set` → recompute → ... an infinite loop that
    // crashes Obsidian.
    let lastQuery = '';
    let lastFuzzy = false;
    // Debounce the (potentially expensive) cross-file search until the user
    // has paused typing, so keystrokes stay smooth.
    let debounceTimer: ReturnType<typeof setTimeout> | null = null;
    let lastScheduledQuery: string | null = null;
    const clearSearchTimer = () => {
        if (debounceTimer !== null) {
            clearTimeout(debounceTimer);
            debounceTimer = null;
        }
    };
    const unsubscribeViewSearch = viewStore.subscribe((state) => {
        const queryChanged = state.search.query !== lastQuery;
        const fuzzyChanged = state.search.fuzzySearch !== lastFuzzy;
        lastQuery = state.search.query;
        lastFuzzy = state.search.fuzzySearch;
        if (!(queryChanged || fuzzyChanged)) return;

        clearSearchTimer();
        // a cleared query recomputes (empties results) immediately
        if (!state.search.query) {
            lastScheduledQuery = null;
            updateGlobalSearchResults(viewStore);
            return;
        }
        lastScheduledQuery = state.search.query;
        debounceTimer = setTimeout(() => {
            debounceTimer = null;
            if (viewStore.getValue().search.query === lastScheduledQuery) {
                updateGlobalSearchResults(viewStore);
                scrollToFirstSearchResult(viewStore, rootEl);
            }
        }, 300);
    });
    const jump = (direction: 1 | -1) => {
        // if a search is pending, resolve it first so we jump against the
        // latest query's results
        if (debounceTimer !== null) {
            clearSearchTimer();
            updateGlobalSearchResults(viewStore);
        }
        jumpToSearchResult(viewStore, rootEl, direction);
    };
    const jumpNext = () => jump(1);
    const jumpPrev = () => jump(-1);
    onDestroy(() => {
        clearSearchTimer();
        unsubscribeView();
        unsubscribeSettings();
        unsubscribeViewSearch();
        unsubscribeReveal();
        globalCardListStore.set([]);
        globalViewStore.set(null);
    });

    const onSelect = (e: { detail: { id: string } }) => {
        const node = findNode(categories.tree, e.detail.id);
        if (!node) return;
        if (node.type === 'category') {
            selectedFolderId = node.parentId;
            selectedCategoryId = node.id;
        } else {
            selectedFolderId = node.id;
            selectedCategoryId = null;
        }
        focusRoot();
    };

    const onSelectorSelect = (e: {
        detail: { folderId: string | null; categoryId: string | null };
    }) => {
        selectedFolderId = e.detail.folderId;
        selectedCategoryId = e.detail.categoryId;
        focusRoot();
    };

    // node id shown as selected in the manage-tree (the category if a
    // category is picked, otherwise the folder)
    $: treeSelectedId = selectedCategoryId ?? selectedFolderId;

    // cards for the current folder + category selection
    $: cards = aggregateCardsForSelection(
        categories,
        selectedFolderId,
        selectedCategoryId,
    );

    const onCardDrop = (e: {
        detail: {
            card: { categoryId: string; filePath: string; section: string };
            targetCategoryId: string;
        };
    }) => {
        const { card, targetCategoryId } = e.detail;
        if (card.categoryId === targetCategoryId) return;
        plugin.settings.dispatch({
            type: 'settings/categories/global/remove-card',
            payload: {
                categoryId: card.categoryId,
                filePath: card.filePath,
                section: card.section,
            },
        });
        plugin.settings.dispatch({
            type: 'settings/categories/global/add-card',
            payload: {
                categoryId: targetCategoryId,
                filePath: card.filePath,
                section: card.section,
            },
        });
    };

    const onMove = (e: {
        detail: {
            id: string;
            targetId: string;
            position: 'before' | 'after' | 'inside';
        };
    }) => {
        const { id, targetId, position } = e.detail;
        let newParentId: string | null;
        let index: number | undefined;

        if (targetId === '__root__') {
            newParentId = null;
            index = categories.tree.length;
        } else {
            const target = findNode(categories.tree, targetId);
            if (!target) return;
            if (position === 'inside') {
                newParentId = target.id;
                index = target.children.length;
            } else {
                const siblings =
                    target.parentId === null
                        ? categories.tree
                        : findNode(categories.tree, target.parentId)
                              ?.children ?? null;
                if (!siblings) return;
                const targetIndex = siblings.findIndex(
                    (n) => n.id === targetId,
                );
                newParentId = target.parentId;
                index = position === 'before' ? targetIndex : targetIndex + 1;
            }
        }

        plugin.settings.dispatch({
            type: 'settings/categories/global/move',
            payload: { id, newParentId, index },
        });
    };

    const onDelete = (e: { detail: { node: { id: string } } }) => {
        plugin.settings.dispatch({
            type: 'settings/categories/global/delete',
            payload: { id: e.detail.node.id },
        });
        // clear selection if the deleted node was selected
        if (selectedCategoryId === e.detail.node.id) {
            selectedCategoryId = null;
        }
        if (selectedFolderId === e.detail.node.id) {
            selectedFolderId = null;
        }
    };
</script>

<div
    class="global-categories-view lineage-view"
    tabindex="0"
    bind:this={rootEl}
    use:globalViewHotkeysAction={{ viewStore }}
>
    <div class="gc-sidebar">
        <div class="gc-sidebar__header">{lang.cm_global_categories}</div>
        <GlobalCategorySelectors
            {categories}
            folderId={selectedFolderId}
            categoryId={selectedCategoryId}
            on:select={onSelectorSelect}
        />
        <div class="gc-tree-section">
            <button
                class="gc-tree-toggle"
                on:click={() => (showTree = !showTree)}
                title={lang.global_categories_manage_tree}
            >
                <span class="gc-tree-toggle__caret" aria-hidden="true">
                    {showTree ? '▾' : '▸'}
                </span>
                <span>{lang.global_categories_manage_tree}</span>
            </button>
            {#if showTree}
                <GlobalCategoriesTree
                    {plugin}
                    tree={categories.tree}
                    selectedNodeId={treeSelectedId}
                    on:select={onSelect}
                    on:move={onMove}
                    on:card-drop={onCardDrop}
                    on:delete={onDelete}
                />
            {/if}
        </div>
    </div>
    <div class="gc-content">
        {#if $viewStore.search.showInput}
            <div class="gc-search-bar">
                <div class="gc-input-fill">
                    <GlobalSearchInput {viewStore} onActivateNext={jump} />
                </div>
                <div class="gc-search-nav">
                    <button
                        class="gc-search-nav-btn"
                        title={lang.tlb_search_previous_result}
                        aria-label={lang.tlb_search_previous_result}
                        on:click={jumpPrev}
                    >
                        <ChevronUp size={14} />
                    </button>
                    <button
                        class="gc-search-nav-btn"
                        title={lang.tlb_search_next_result}
                        aria-label={lang.tlb_search_next_result}
                        on:click={jumpNext}
                    >
                        <ChevronDown size={14} />
                    </button>
                </div>
            </div>
        {/if}
        <GlobalCategoryCards
            {plugin}
            {categories}
            {cards}
            {viewStore}
            {leaf}
            {containerEl}
        />
    </div>
</div>

<style>
    .global-categories-view {
        height: 100%;
        width: 100%;
        display: flex;
        overflow: hidden;
        /* same background as the main lineage view */
        background-color: var(--background-container);
    }

    .gc-sidebar {
        width: 260px;
        flex: 0 0 260px;
        border-right: 1px solid var(--background-modifier-border);
        display: flex;
        flex-direction: column;
        height: 100%;
        overflow: hidden;
    }

    .gc-sidebar__header {
        padding: 8px 10px;
        font-size: var(--font-ui-small);
        font-weight: var(--font-semibold);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--text-muted);
        border-bottom: 1px solid var(--background-modifier-border);
    }

    .gc-tree-section {
        display: flex;
        flex-direction: column;
        flex: 1 1 auto;
        min-height: 0;
        overflow: hidden;
    }

    .gc-tree-toggle {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 6px 10px;
        border: none;
        background: none;
        color: var(--text-muted);
        font-size: var(--font-ui-small);
        cursor: pointer;
        text-align: left;
    }

    .gc-tree-toggle:hover {
        color: var(--text-normal);
        background-color: var(--background-modifier-hover);
    }

    .gc-tree-toggle__caret {
        flex: 0 0 auto;
        font-size: 10px;
    }

    .gc-content {
        flex: 1 1 auto;
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        padding: 10px;
    }

    .gc-search-bar {
        flex: 0 0 auto;
        padding: 0 0 10px;
        display: flex;
        gap: 6px;
        align-items: center;
    }

    .gc-search-bar .gc-input-fill {
        flex: 1 1 auto;
        min-width: 0;
    }

    .gc-search-nav {
        display: flex;
        gap: 4px;
        flex: 0 0 auto;
    }

    .gc-search-nav-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        border-radius: 4px;
        border: 1px solid var(--background-modifier-border);
        background-color: var(--background-secondary);
        color: var(--text-muted);
        cursor: pointer;
        padding: 0;
    }

    .gc-search-nav-btn:hover {
        background-color: var(--interactive-hover);
        border-color: var(--interactive-accent);
        color: var(--text-normal);
    }

    .gc-search-nav-btn:disabled {
        opacity: 0.4;
        cursor: default;
    }

    .gc-content__placeholder {
        margin: auto;
        color: var(--text-muted);
        font-size: var(--font-ui-small);
        text-align: center;
        padding: 20px;
    }
</style>
