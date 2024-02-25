<script lang="ts">
	import { TrashIcon } from 'lucide-svelte';
	import { getStore } from '../../../../../../../get-store';
	import FloatingButton from './floating-button.svelte';

	const store = getStore();
    // eslint-disable-next-line no-undef
    const deleteNode = (e: MouseEvent) => {
        e.stopPropagation();
        store.dispatch({
            type: 'TREE/DELETE_NODE',
        });
    };
</script>

<FloatingButton on:click={deleteNode} position={'top-right'}>
        <TrashIcon class="svg-con" />
</FloatingButton>
