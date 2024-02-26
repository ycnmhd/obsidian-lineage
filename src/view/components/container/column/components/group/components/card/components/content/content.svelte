<script lang="ts">
	import { getStore } from '../../../../../../../context';
	import { ColumnNode } from 'src/stores/document/document-reducer';

	export let node: ColumnNode;
    const store = getStore();
</script>

<div
    class="content"
    on:dblclick={() => {
        store.dispatch({ type: 'ENABLE_EDIT_MODE' });
    }}
>
    {#each node.content.split('\n') as line}
        <span>{line}</span><br />
    {/each}
</div>

<style>
	.content {
		width: 100%;
		min-height: 100px;
		padding: 6px;
		font-size: 16px;
	}
</style>
