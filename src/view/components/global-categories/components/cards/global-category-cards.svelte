<script lang="ts">
    import Lineage from 'src/main';
    import FileCardGroup from './file-card-group.svelte';
    import {
        GlobalCategories,
    } from 'src/stores/settings/types/global-categories-types';
    import { ResolvedGlobalCard } from '../../helpers/tree-utils';
    import { moveCardInCategory } from '../../helpers/move-card-in-category';
    import { lang } from 'src/lang/lang';
    import { ViewStore } from 'src/view/view';
    import { WorkspaceLeaf } from 'obsidian';
    import {
        globalCardListStore,
        GlobalCardNavItem,
    } from '../../helpers/global-view-keyboard';

    export let plugin: Lineage;
    export let categories: GlobalCategories;
    export let cards: ResolvedGlobalCard[];
    export let viewStore: ViewStore;
    export let leaf: WorkspaceLeaf;
    export let containerEl: HTMLElement;

    let listEl: HTMLElement;

    // Ordered navigation list (per file group) consumed by the keyboard
    // navigation of the global view.
    const resolvedByFile = new Map<string, GlobalCardNavItem[]>();
    let orderedList: GlobalCardNavItem[] = [];

    const rebuildOrderedList = () => {
        orderedList = grouped.flatMap(
            (g) => resolvedByFile.get(g.filePath) ?? [],
        );
        globalCardListStore.set(orderedList);
    };

    const onResolvedCards = (
        filePath: string,
        items: GlobalCardNavItem[],
    ) => {
        resolvedByFile.set(filePath, items);
        rebuildOrderedList();
    };

    const removeCard = (card: ResolvedGlobalCard) => {
        plugin.settings.dispatch({
            type: 'settings/categories/global/remove-card',
            payload: {
                categoryId: card.categoryId,
                filePath: card.filePath,
                section: card.section,
            },
        });
    };

    const moveCard = (card: ResolvedGlobalCard, delta: number) => {
        moveCardInCategory(
            plugin,
            card.categoryId,
            card,
            delta,
        );
    };

    // Visible (post-search-filter) card count comes from the keyboard nav
    // list, which the file groups rebuild from their filtered cards.
    $: visibleCount = $globalCardListStore.length;
    $: searchActive = Boolean($viewStore.search.query);

    $: grouped = (() => {
        const map = new Map<string, ResolvedGlobalCard[]>();
        for (const card of cards) {
            const arr = map.get(card.filePath) ?? [];
            arr.push(card);
            map.set(card.filePath, arr);
        }
        return Array.from(map.entries()).map(([filePath, fileCards]) => ({
            filePath,
            cards: fileCards,
        }));
    })();
</script>

<div class="gc-cards" bind:this={listEl}>
    {#if cards.length === 0}
        <div class="gc-cards__empty">{lang.global_categories_empty_cards}</div>
    {:else if searchActive && visibleCount === 0}
        <div class="gc-cards__empty">
            {lang.global_categories_search_no_results}
        </div>
    {:else}
        {#each grouped as group (group.filePath)}
            <FileCardGroup
                {plugin}
                filePath={group.filePath}
                cards={group.cards}
                {viewStore}
                {leaf}
                containerEl={listEl || containerEl}
                onRemoveCard={removeCard}
                onMoveCard={moveCard}
                onResolvedCards={onResolvedCards}
            />
        {/each}
    {/if}
</div>

<style>
    .gc-cards {
        flex: 1 1 auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 24px;
        overflow-y: auto;
        padding: 12px 16px 24px;
        width: 100%;
    }

    .gc-cards__empty {
        margin: auto;
        color: var(--text-muted);
        font-size: var(--font-ui-small);
        text-align: center;
        padding: 20px;
        white-space: pre-line;
    }
</style>
