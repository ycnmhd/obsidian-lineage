<script lang="ts">
	import { Column } from 'src/stores/view/view-state-type';
	import Group from './components/group/group.svelte';
	import { getStore } from 'src/view/components/container/context';

	const store = getStore();
    export let column: Column;
</script>

<div class="column" id={column.id}>
    <div class="column-buffer" />
    {#each column.groups as group (group.parentId)}
        {#if !$store.document.state.dnd.childGroups.has(group.parentId)}
            <Group {group} />
        {/if}
    {/each}
    <div class="column-buffer" />
</div>

<style>



    .column {
        width: fit-content;
        height: 100vh;
        overflow-y: scroll;
    }

    .column::-webkit-scrollbar {
        display: none;
    }
    .column-buffer {
        height: 60vh;
    }
</style>
