<script lang="ts">
    import { ViewStore } from 'src/view/view';
    import { lang } from 'src/lang/lang';
    import { Text, X } from 'lucide-svelte';

    export let viewStore: ViewStore;
    // optional handler for jumping to the next/previous search result
    // (Enter / Shift+Enter on the input)
    export let onActivateNext: ((direction: 1 | -1) => void) | undefined =
        undefined;

    $: search = $viewStore.search;

    const onKeydown = (
        // eslint-disable-next-line no-undef
        e: KeyboardEvent,
    ) => {
        if (e.key !== 'Enter') return;
        e.preventDefault();
        onActivateNext?.(e.shiftKey ? -1 : 1);
    };

    const onInput = (
        // eslint-disable-next-line no-undef
        e: Event & { currentTarget: EventTarget & HTMLInputElement },
    ) => {
        viewStore.dispatch({
            type: 'view/search/set-query',
            payload: { query: e.currentTarget.value },
        });
    };

    const clear = () => {
        viewStore.dispatch({
            type: 'view/search/set-query',
            payload: { query: '' },
        });
    };

    const toggleFuzzy = () => {
        viewStore.dispatch({ type: 'view/search/toggle-fuzzy-mode' });
    };
</script>

<div class="gc-search-input-wrapper">
    <input
        autofocus={true}
        class="gc-search-input"
        type="search"
        enterkeyhint="search"
        spellcheck="false"
        placeholder={lang.global_categories_search_cards}
        value={search.query}
        on:input={onInput}
        on:keydown={onKeydown}
    />
    {#if search.query.length > 0}
        <button
            class="gc-search-clear"
            title={lang.tlb_search_clear}
            aria-label={lang.tlb_search_clear}
            on:click={clear}
        >
            <X size={14} />
        </button>
    {/if}
    <button
        class={'gc-search-fuzzy' +
            (search.fuzzySearch ? ' is-active' : '')}
        title={lang.tlb_search_fuzzy_search}
        aria-label={lang.tlb_search_fuzzy_search}
        on:click={toggleFuzzy}
    >
        <Text size={14} />
    </button>
</div>

<style>
    .gc-search-input-wrapper {
        position: relative;
        display: flex;
        align-items: center;
        width: 100%;
    }

    .gc-search-input {
        width: 100%;
        height: 34px;
        padding: 0 64px 0 12px;
        border-radius: 6px;
        border: 1px solid var(--background-modifier-border);
        background-color: var(--background-secondary);
        color: var(--text-normal);
        font-size: var(--font-ui-small);
    }

    .gc-search-input:focus {
        border-color: var(--interactive-accent);
        box-shadow: 0 0 0 2px var(--background-modifier-border-hover);
        outline: none;
    }

    .gc-search-clear,
    .gc-search-fuzzy {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        border: none;
        background: none;
        color: var(--text-muted);
        cursor: pointer;
        padding: 0;
        border-radius: 4px;
    }

    .gc-search-clear {
        right: 32px;
    }

    .gc-search-fuzzy {
        right: 4px;
    }

    .gc-search-clear:hover,
    .gc-search-fuzzy:hover {
        color: var(--text-normal);
        background-color: var(--background-modifier-hover);
    }

    .gc-search-fuzzy.is-active {
        color: var(--interactive-accent);
    }
</style>
