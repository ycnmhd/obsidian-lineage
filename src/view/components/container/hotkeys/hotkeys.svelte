<script lang="ts">
    import Hotkey from './components/command.svelte';
    import { getPlugin } from 'src/view/components/container/context';
    import { hotkeyStore } from 'src/stores/hotkeys/hotkey-store';
    import { onMount } from 'svelte';
    import {
        checkForHotkeyConflicts
    } from 'src/stores/hotkeys/effects/check-for-hotkey-conflicts/check-for-hotkey-conflicts';
    import { filteredHotkeys } from 'src/stores/hotkeys/derived/filtered-hotkeys';

    const plugin = getPlugin();
    let searchTerm = '';

    $: {
        hotkeyStore.dispatch({
            type: 'UI/SET_SEARCH_TERM',
            payload: {
                searchTerm,
            },
        });
    }
    onMount(() => {
        return checkForHotkeyConflicts(plugin);
    });
</script>

<div class="sidebar">
    <div class="front">
        <span class="title">Keyboard shortcuts </span>
        <div class="search-input-container">
            <input
                bind:value={searchTerm}
                class="search-input"
                enterkeyhint="search"
                placeholder={'Filter'}
                spellcheck="false"
                type="search"
            />
            <div
                aria-label={'Clear'}
                class="search-input-clear-button"
                on:click={() => {
                    searchTerm = '';
                }}
            ></div>
        </div>
    </div>
    <div class="hotkeys-list">
        {#each $filteredHotkeys as commandHotkeys (commandHotkeys.name)}
            <Hotkey {commandHotkeys} />
        {/each}
    </div>
    <div class="note">
        *If a keyboard shortcut is not working, make sure it is not assigned to
        an Obsidian command.
    </div>
</div>

<style>
    .sidebar {
        width: 350px;
        background-color: var(--background-secondary);
        position: absolute;
        right: var(--sidebar-right);
        top: var(--size-4-2);
        padding: var(--size-4-2) 0;
    }

    .hotkeys-list {
        display: flex;
        flex-direction: column;
        gap: 5px;
        max-height: 200px;
        overflow-y: auto;
        padding: var(--size-4-2);
    }

    .front {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        padding: 12px var(--size-4-2);
    }
    .title {
        font-size: 16px;
        color: var(--color-base-70);
    }
    .search-input-container {
        width: 150px;
    }
    .note {
        font-size: 12px;
        color: var(--color-base-40);
        padding: var(--size-4-2);
    }
</style>
