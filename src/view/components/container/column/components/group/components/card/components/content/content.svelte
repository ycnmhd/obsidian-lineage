<script lang="ts">
	import { ColumnNode } from 'src/stores/document/document-reducer';

	export let node: ColumnNode;
</script>

<div
    class="content"

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
