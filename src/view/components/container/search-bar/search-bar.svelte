<script lang="ts">
    import { Search } from 'lucide-svelte';
    import { getStore } from 'src/view/components/container/context';

    const store = getStore();
    let searchTerm = '';
    $: {
        store.dispatch({
            type: 'SEARCH/SET_QUERY',
            payload: {
                query: searchTerm,
            },
        });

    }
</script>

<div class="search-container">
    <button
        aria-label={'Search'}

        class={$store.search.showInput? 'search-toggle-active':"" }
        data-tooltip-position="bottom"
        id="toggle-search"
        on:click={() => {
            store.dispatch({ type: "SEARCH/TOGGLE_INPUT"})
        }}
    >
        <Search class="svg-icon" size="12" />
    </button>
    {#if $store.search.showInput}
        <div class="">
            <input
                bind:value={searchTerm}
                class="search-input search-input-element"
                enterkeyhint="search"
                placeholder={'Filter'}
                spellcheck="false"
                type="search"
                autofocus="autofocus"
            />
            <div
                style={searchTerm?"":"display: none"}
                aria-label={'Clear'}
                class="search-input-clear-button"
                on:click={() => {
                    searchTerm = '';
                }}
            ></div>
        </div>
    {/if}
</div>

<style>
    .search-container {
        z-index: var(--z-index-breadcrumbs);
        top: var(--size-4-2);
        left: calc(70px + var(--size-4-2));
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: var(--radius-s);
        background-color: var(--interactive-normal);
        border: 1px solid var(--background-modifier-border);
        box-shadow: var(--input-shadow);
        overflow: hidden;
    }

    .search-input-element {
        height: 30px;
        width: 300px;
    }

    .search-toggle-active {
        background-color: var(--color-base-40);
    }
</style>
