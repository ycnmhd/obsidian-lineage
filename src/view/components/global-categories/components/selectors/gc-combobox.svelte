<script lang="ts">
    import { createEventDispatcher, onDestroy, onMount } from 'svelte';
    import { lang } from 'src/lang/lang';

    export let options: { value: string | null; label: string }[] = [];
    export let value: string | null = null;
    export let placeholder: string;
    export let searchPlaceholder: string;

    const dispatch = createEventDispatcher<{ select: { value: string | null } }>();

    let open = false;
    let query = '';
    let inputEl: HTMLInputElement;
    let rootEl: HTMLElement;

    $: selectedLabel =
        options.find((o) => o.value === value)?.label ?? null;
    $: filtered = query.trim()
        ? options.filter((o) =>
              o.label.toLowerCase().includes(query.trim().toLowerCase()),
          )
        : options;

    const toggle = () => {
        open = !open;
        if (open) query = '';
    };

    // focus the filter input whenever the panel opens
    $: if (open && inputEl) {
        inputEl.focus();
    }

    const select = (v: string | null) => {
        open = false;
        dispatch('select', { value: v });
    };

    const onKeydown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            e.stopPropagation();
            open = false;
        } else if (e.key === 'Enter') {
            e.stopPropagation();
            e.preventDefault();
            if (filtered.length > 0) select(filtered[0].value);
        }
    };

    const onClickOutside = (e: MouseEvent) => {
        if (!rootEl.contains(e.target as Node)) open = false;
    };

    onMount(() => window.addEventListener('mousedown', onClickOutside));
    onDestroy(() => window.removeEventListener('mousedown', onClickOutside));
</script>

<div class="gc-combobox" bind:this={rootEl}>
    <button
        class="gc-combobox__trigger"
        on:click={toggle}
        title={selectedLabel ?? placeholder}
    >
        <span class="gc-combobox__label">
            {selectedLabel ?? placeholder}
        </span>
        <span class="gc-combobox__caret" aria-hidden="true">▾</span>
    </button>
    {#if open}
        <div class="gc-combobox__panel">
            <input
                bind:this={inputEl}
                bind:value={query}
                class="gc-combobox__search"
                placeholder={searchPlaceholder}
                on:keydown={onKeydown}
                on:click|stopPropagation
            />
            <div class="gc-combobox__list">
                {#if filtered.length === 0}
                    <div class="gc-combobox__empty">
                        {lang.global_categories_no_matches}
                    </div>
                {:else}
                    {#each filtered as option (option.value ?? '__all__')}
                        <button
                            class="gc-combobox__option"
                            class:gc-combobox__option--selected={option.value ===
                                value}
                            on:click|stopPropagation={() =>
                                select(option.value)}
                        >
                            {option.label}
                        </button>
                    {/each}
                {/if}
            </div>
        </div>
    {/if}
</div>

<style>
    .gc-combobox {
        position: relative;
        width: 100%;
    }

    .gc-combobox__trigger {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        padding: 6px 10px;
        border: 1px solid var(--background-modifier-border);
        border-radius: 4px;
        background-color: var(--background-primary);
        color: var(--text-normal);
        font-size: var(--font-ui-small);
        cursor: pointer;
        text-align: left;
    }

    .gc-combobox__trigger:hover {
        border-color: var(--interactive-accent);
    }

    .gc-combobox__label {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .gc-combobox__caret {
        flex: 0 0 auto;
        color: var(--text-muted);
        font-size: 10px;
    }

    .gc-combobox__panel {
        position: absolute;
        top: calc(100% + 2px);
        left: 0;
        right: 0;
        z-index: 100;
        background-color: var(--background-primary);
        border: 1px solid var(--background-modifier-border);
        border-radius: 6px;
        box-shadow: var(--shadow-s);
        overflow: hidden;
        display: flex;
        flex-direction: column;
        max-height: 240px;
    }

    .gc-combobox__search {
        width: 100%;
        box-sizing: border-box;
        padding: 6px 8px;
        border: none;
        border-bottom: 1px solid var(--background-modifier-border);
        background-color: var(--background-secondary);
        color: var(--text-normal);
        font-size: var(--font-ui-small);
        outline: none;
    }

    .gc-combobox__search:focus {
        box-shadow: inset 0 0 0 1px var(--interactive-accent);
    }

    .gc-combobox__list {
        overflow-y: auto;
        padding: 4px;
        display: flex;
        flex-direction: column;
        gap: 1px;
    }

    .gc-combobox__option {
        text-align: left;
        padding: 5px 8px;
        border: none;
        border-radius: 4px;
        background: none;
        color: var(--text-normal);
        font-size: var(--font-ui-small);
        cursor: pointer;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .gc-combobox__option:hover {
        background-color: var(--background-modifier-hover);
    }

    .gc-combobox__option--selected {
        background-color: var(--interactive-accent);
        color: var(--text-on-accent);
    }

    .gc-combobox__option--selected:hover {
        background-color: var(--interactive-accent);
    }

    .gc-combobox__empty {
        padding: 8px;
        color: var(--text-muted);
        font-size: var(--font-ui-small);
        text-align: center;
    }
</style>
