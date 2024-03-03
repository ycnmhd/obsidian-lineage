<script lang="ts">
	import { getStore } from '../../../../../../../context';
	import { draggable } from 'src/view/actions/dnd/draggable';

	export let nodeId: string
	const store = getStore();

</script>
<div class="draggable" use:draggable={{ id: nodeId, store }}>
	<div class="drag-handle"></div>
	<div
		class="content"
		on:dblclick={() => {
                    store.dispatch({ type: 'DOCUMENT/ENABLE_EDIT_MODE' });
                }}
	>
		<slot/>
	</div>
</div>

<style>
	.draggable {
		width: 100%;
		background-color: transparent;
		display: flex;
		position: relative;
	}
	.drag-handle {
		height: 100%;
		width: 5px;
		background-color: transparent;
		cursor: grab;
		position: absolute;
		left: 0
	}
	.draggable:hover .drag-handle {
		background-size: 2px 4px;
		background-image: linear-gradient(
			0deg,
			hsla(0, 0%, 44.7%, 0.25) 20%,
			transparent 40%
		);
	}



</style>
