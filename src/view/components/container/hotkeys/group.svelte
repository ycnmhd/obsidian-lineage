<script lang="ts">
    import Hotkey from './components/command.svelte';
    import { CommandHotkeys } from 'src/stores/hotkeys/hotkey-store';

    export let group: CommandHotkeys[]
export let groupName: string
</script>
<div class="group">
    <div class="group-name">{groupName}</div>
    <div class="hotkeys-list">
        {#each group as commandHotkeys (commandHotkeys.name)}
            <Hotkey {commandHotkeys} />
        {/each}
    </div>
</div>

<style>
    .group {
        background-color: var(--background-secondary);
        padding: var(--size-4-2);
        border-radius: 3px;
    }
    .hotkeys-list {
        display: flex;
        flex-direction: column;
        gap:var(--size-4-2);
        overflow-y: auto;
    }

    .group-name {
        padding-bottom: 10px;
        padding-left: 5px;
        font-size: 16px;
        color: var(--color-base-70);
    }

</style>
