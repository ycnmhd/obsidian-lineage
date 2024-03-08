<script lang="ts">
    import Hotkey from './hotkey/hotkey.svelte';
    import { hotkeysLang } from 'src/view/actions/keyboard-shortcuts/helpers/commands/command-names';
    import { CommandHotkeys } from 'src/stores/hotkeys/hotkey-store';

    export let commandHotkeys: CommandHotkeys;
</script>

<div class="command">
    <span class="label">{hotkeysLang[commandHotkeys.name]}</span>
    <div class="hotkeys">
        {#each commandHotkeys.hotkeys as hotkey, i}
            <Hotkey {hotkey} commandName={commandHotkeys.name} isPrimary={i === 0} />
        {/each}
    </div>
</div>

<style>
    .command {
        padding: 8px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-radius: 4px;
        gap: 8px;
        background-color: var(--color-base-70);
    }
    .hotkeys {
        display: flex;
        flex-direction: column;
        align-items: end;
        gap: 5px;
    }

    .label {
        font-size: 14px;
        color: var(--color-base-20);
        display: block;
    }
</style>
