<script lang="ts">
    import { Pen } from 'lucide-svelte';
    import { Hotkey } from 'obsidian';

    export let enableEditing: () => void;
    export let hotkey: Hotkey;
</script>

<div class="hotkey-buttons">
    <button class="hotkey-button" on:click={enableEditing}
        ><Pen class="svg-icon" size={8} /></button
    >
</div>
<kbd class="hotkey-key">{hotkey.key}</kbd>
{#each hotkey.modifiers as modifier}
    <kbd>{modifier}</kbd>
{/each}

<style>
    .hotkey-buttons {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 5px;
        opacity: 0;
        background-color: var(--color-base-70);
    }
    .hotkey-button {
        /*background-color: transparent;*/
        border: none;
        width: 16px;
        height: 16px;
        box-shadow: none;
        padding: 2px;
        cursor: pointer;
    }
    .hotkey-buttons:hover {
        opacity: 0.8;
    }
    .hotkey-key {
        color: lightgrey;
        background-color: #175c5a;
    }
</style>
