<script lang="ts">
	import { NodeDirection } from 'src/stores/document/document-reducer';
	import { getStore } from '../../../../../../../context';
	import FloatingButton from './floating-button.svelte';
	import { ChevronDown, ChevronRight, ChevronUp } from 'lucide-svelte';

	export let position: NodeDirection;
    const store = getStore();
    const createCard = (e: MouseEvent) => {
        e.stopPropagation();
        store.dispatch({
            type: 'CREATE_NODE',
            payload: {  position },
        });
    };
	const chevrons = {
		right: ChevronRight,
		top:ChevronUp,
		bottom: ChevronDown
	}
</script>

<FloatingButton on:click={createCard} {position}>
	<svelte:component this={chevrons[position]}></svelte:component>
</FloatingButton>

<style>
</style>
