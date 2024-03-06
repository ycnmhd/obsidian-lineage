<script lang="ts">
    import { hotkeyToString } from 'src/view/actions/keyboard-shortcuts/helpers/keyboard-events/hotkey-to-string';
    import { Hotkey } from 'obsidian';

    export let hotkey: Hotkey;
    export let usedHotkeys: Map<string, string>;
    const conflicting = usedHotkeys.get(hotkeyToString(hotkey));
</script>

<div
    aria-label={conflicting ? 'In conflict with ' + conflicting : ''}
    class={'hotkey' + (conflicting ? ' conflicting' : '')}
>
    {#each hotkey.modifiers as modifier}
        <kbd>{modifier}</kbd>
    {/each}
    <kbd>{hotkey.key}</kbd>
</div>

<style>
    .hotkey {
        padding: 5px;
        background-color: var(--color-base-60);
        display: flex;
        gap: 5px;
        border-radius: 3px;
        width: fit-content;
    }

    .conflicting {
        background-color: var(--color-red);
    }
</style>
