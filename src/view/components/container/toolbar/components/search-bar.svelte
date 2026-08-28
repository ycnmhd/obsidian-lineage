<script lang="ts">
    import { getView } from 'src/view/components/container/context';
    import { searchStore } from 'src/stores/view/derived/search-store';
    import SearchInput from './search-input.svelte';
    import SearchNavigationButtons from './search/search-navigation-buttons.svelte';
    import SearchActions from './search-actions.svelte';

    const view = getView();

    const search = searchStore(view);
</script>

{#if $search.showInput}
    <div class="lineage-search-bar">
        <SearchInput />
        {#if $search.query.length > 0}
            <SearchNavigationButtons
                results={Array.from($search.results.keys())}
            />
            {#if $search.results.size > 0}
                <SearchActions />
            {/if}
        {/if}
    </div>
{/if}

<style>
    .lineage-search-bar {
        z-index: var(--z-index-breadcrumbs);
        left: var(--size-4-2);
        top: var(--size-4-2);
        display: flex;
        position: absolute;
        gap: var(--size-4-2);
        flex-wrap: wrap;
        max-width: 90%;
    }
</style>
