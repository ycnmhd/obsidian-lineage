<script lang="ts">
    import { hotkeysLang, PluginCommand } from 'src/view/actions/keyboard-shortcuts/helpers/create-commands';
    import Hotkey from './hotkey.svelte';

    export let key: keyof typeof hotkeysLang;
    export let command: PluginCommand;
    export let usedHotkeys: Map<string,string>
</script>

<div class="command">
    <span class="label">{hotkeysLang[key]}</span>
    <div class="hotkeys">
        {#each command.hotkeys as hotkey}
           <Hotkey {hotkey} {usedHotkeys}/>
        {/each}
    </div>
</div>

<style>
    .command {
        padding: 8px;
        cursor: pointer;
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
        gap: 5px
    }



    .label {
        font-size: 14px;
        color: var(--color-base-20);
        display: block;
    }
</style>
