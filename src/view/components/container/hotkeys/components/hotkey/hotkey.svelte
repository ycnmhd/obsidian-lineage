<script lang="ts">
    import RenderHotkey from './render-hotkey.svelte';
    import EditHotkey from './edit-hotkey.svelte';
    import clx from 'classnames';

    import { CommandName } from 'src/view/actions/keyboard-shortcuts/helpers/commands/command-names';
    import { ExtendedHotkey } from 'src/stores/hotkeys/hotkey-store';

    export let hotkey: ExtendedHotkey;
    export let commandName: CommandName;
    export let isPrimary: boolean;
    let editing = false;
</script>

<div
    aria-label={hotkey.obsidianConflict
        ? 'Obsidian conflict: ' + hotkey.obsidianConflict
        : hotkey.pluginConflict
          ? 'Plugin conflict: ' + hotkey.pluginConflict
          : ''}
    class={clx(
        'hotkey',
        hotkey.obsidianConflict && 'obsidian-conflict',
        hotkey.pluginConflict && 'plugin-conflict',
        editing && 'editing',
    )}
>
    {#if editing}
        <EditHotkey
            {hotkey}
            onCancel={() => (editing = false)}
            {isPrimary}
            {commandName}
        />
    {:else}
        <RenderHotkey {hotkey} enableEditing={() => (editing = true)} />
    {/if}
</div>

<style>
    .hotkey {
        padding: 5px;
        background-color: var(--color-base-60);
        display: flex;
        gap: 5px;
        border-radius: 3px;
        width: fit-content;
        position: relative;
    }

    .editing {
        background-color: var(--color-base-60);
    }
    .obsidian-conflict {
        background-color: var(--color-red);
    }
    .plugin-conflict {
        background-color: var(--color-orange);
    }
</style>
