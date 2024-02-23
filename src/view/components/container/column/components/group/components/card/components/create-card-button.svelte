<script lang="ts">
	import { NodePosition } from 'src/view/store/document-reducer';
	import { getStore } from 'src/view/components/container/get-store';
	import FloatingButton from './floating-button.svelte';
	import { PlusIcon } from 'lucide-svelte';

	export let position: NodePosition;
    export let nodeId: string;
    export let parentId: string;
    const store = getStore();
    const createCard = (e: MouseEvent) => {
        e.stopPropagation();
        store.dispatch({
            type: 'CREATE_NODE',
            payload: { nodeId: nodeId, parentId, position },
        });
    };
</script>

<FloatingButton on:click={createCard} {position}><PlusIcon /></FloatingButton>

<style>
</style>
