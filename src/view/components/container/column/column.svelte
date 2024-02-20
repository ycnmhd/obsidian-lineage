<script lang="ts">
	import { Column } from '../../../store/document-reducer';
	import Group from './components/group/group.svelte';

	export let column: Column;
</script>

<div class="column" id={column.id}>
    <div class="column-buffer" />
        {#each column.groups as group (group.id)}
          <Group {group}/>
        {/each}
    <div class="column-buffer" />
</div>

<style>
    :root {
        --node-width: 400px;
    }
	.column {
		width: var(--node-width);
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
