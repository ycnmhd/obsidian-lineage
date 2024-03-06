<script lang="ts">
    import {
        createCommands,
        hotkeysLang,
        LineageCommandName
    } from '../../../actions/keyboard-shortcuts/helpers/create-commands'; // Import the PluginCommand type
    import Hotkey from './components/command.svelte';
    import { getPlugin, getView } from 'src/view/components/container/context';
    import {
        detectConflictingHotkeys
    } from 'src/view/actions/keyboard-shortcuts/helpers/keyboard-events/detect-conflicting-hotkeys';

    const plugin = getPlugin();
    const commands = createCommands(plugin);
    const view = getView();
    const usedHotkeys = detectConflictingHotkeys(
        plugin,
        Object.values(commands),
        view.containerEl,
    );
    let searchTerm = '';

    const entries = Object.keys(commands).map((k) => [
        hotkeysLang[k as LineageCommandName].toLowerCase(),
        k,
    ]);
    let matches = new Set();
    $: {
        matches = new Set();
        if (searchTerm) {
            const search_term = searchTerm.toLowerCase();
            for (const [name, key] of entries) {
                if (name.includes(search_term)) {
                    matches.add(key);
                }
            }
        }
    }
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
        {#each Object.entries(commands) as [key, command]}
            {#if !matches.size || matches.has(key)}
                <Hotkey {key} {command} {usedHotkeys} />
            {/if}
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
