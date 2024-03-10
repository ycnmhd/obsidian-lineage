<script lang="ts">
    import { filteredHotkeys } from 'src/stores/hotkeys/derived/filtered-hotkeys';
    import Group from './group.svelte';
    import Front from './front.svelte';
</script>

<div class="sidebar">
    <Front />
    <div class="groups">
        {#each Object.entries($filteredHotkeys) as [groupName, group] (groupName)}
            <Group {groupName} {group} />
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
        background-color: var(--background-primary);
        position: absolute;
        right: var(--sidebar-right);
        top: var(--size-4-2);
        padding: var(--size-4-2) 0;
        display: flex;
        flex-direction: column;
        gap: var(--size-4-2)
    }

    .groups {
        padding:0 var(--size-4-2);
        display: flex;
        flex-direction: column;
        gap: var(--size-4-2);
        max-height: 400px;
        overflow-y: auto;
    }

    .note {
        font-size: 12px;
        color: var(--color-base-40);
        padding: var(--size-4-2);
    }
</style>
