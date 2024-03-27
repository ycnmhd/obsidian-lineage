<script lang="ts">
    import { Column } from 'src/stores/document/document-state-type';
    import Group from './components/group/group.svelte';
    import { getView } from 'src/view/components/container/context';

    const view = getView();
    const viewStore = view.viewStore;
    export let column: Column;
</script>

<div class="column" id={column.id}>
    <div class="column-buffer" />
    {#each column.groups as group (group.parentId)}
        {#if !$viewStore.document.dnd.childGroups.has(group.parentId)}
            <Group {group} />
        {/if}
    {/each}
    <div class="column-buffer" />
</div>

<style>
    .column {
        width: fit-content;
        min-width: 416px;
        height: 100vh;
        overflow-y: scroll;
        overflow-x: hidden;
    }

    .column::-webkit-scrollbar {
        display: none;
    }
    .column-buffer {
        height: 60%
    }
</style>
