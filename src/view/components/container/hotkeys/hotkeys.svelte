<script lang="ts">
	import { createCommands } from '../../../actions/keyboard-shortcuts/helpers/create-commands'; // Import the PluginCommand type
	import Hotkey from './components/hotkey.svelte';

	const commands = createCommands();
</script>

<div class="sidebar">
    <span class="title">Keyboard shortcuts</span>
    <div class="hotkeys-list">
        {#each Object.entries(commands) as [key, command]}
            <Hotkey {key} {command} />
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

    .title {
        font-size: 16px;
        color: var(--color-base-70);
        padding: 12px var(--size-4-2);
    }
    .note {
        font-size: 12px;
        color: var(--color-base-40);
        padding: var(--size-4-2);
    }
</style>
