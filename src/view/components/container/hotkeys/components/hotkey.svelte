<script lang="ts">
	import { hotkeysLang, PluginCommand } from 'src/view/actions/keyboard-shortcuts/helpers/create-commands';

	export let key: keyof typeof hotkeysLang;
    export let command: PluginCommand;
</script>

<div class="command">
    <span class="label">{hotkeysLang[key]}</span>
    <div class="hotkeys">
        {#each command.hotkeys as hotkey}
            <div class="hotkey">
                {#each hotkey.modifiers as modifier}
                    <kbd>{modifier}</kbd>
                {/each}
                <kbd>{hotkey.key}</kbd>
            </div>
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
        gap: 5px
    }
    .hotkey {
        padding:5px;
        background-color: var(--color-base-60);
        display: flex;
        gap: 5px;
		border-radius: 3px;
    }



    .label {
        font-size: 14px;
        color: var(--color-base-20);
        display: block;
    }
</style>
