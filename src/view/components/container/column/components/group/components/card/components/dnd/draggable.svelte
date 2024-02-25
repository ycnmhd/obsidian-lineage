<script lang="ts">
	import { getStore } from '../../../../../../../get-store';
	import { draggable } from 'src/view/actions/dnd/draggable';

	export let nodeId: string
	const store = getStore();

</script>
<div class="draggable" use:draggable={{ id: nodeId, store }}>
	<div class="drag-handle"></div>
	<div
		class="content"
		on:dblclick={() => {
                    store.dispatch({ type: 'ENABLE_EDIT_MODE' });
                }}
	>
		<slot/>
	</div>
</div>

<style>
	.draggable {
		width: 100%;
		border-radius: var(--border-radius);
		background-color: transparent;
		display: flex;
	}
	.drag-handle {
		height: 100%;
		width: 8px;
		background-color: transparent;
		cursor: grab;
	}
	.draggable:hover .drag-handle {
		background-size: 2px 4px;
		background-image: linear-gradient(
			0deg,
			hsla(0, 0%, 44.7%, 0.25) 20%,
			transparent 50%
		);
	}



</style>
