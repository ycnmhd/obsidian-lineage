<script lang="ts">
	import { getStore } from '../../../../../../../context';
	import FloatingButton from './floating-button.svelte';
	import { ChevronDown, ChevronRight, ChevronUp } from 'lucide-svelte';

	export let position:  "up" | "right" | "down" ;
    const store = getStore();
	// eslint-disable-next-line no-undef
    const createCard = (e: MouseEvent) => {
        e.stopPropagation();
        store.dispatch({
            type: 'DOCUMENT/INSERT_NODE',
            payload: {  position },
        });
    };
	const chevrons = {
		right: ChevronRight,
		up:ChevronUp,
		down: ChevronDown
	}
</script>

<FloatingButton on:click={createCard} {position}>
	<svelte:component this={chevrons[position]}></svelte:component>
</FloatingButton>

<style>
</style>
