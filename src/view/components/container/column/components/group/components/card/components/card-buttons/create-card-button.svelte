<script lang="ts">
	import { getPlugin } from '../../../../../../../context';
	import FloatingButton from './floating-button.svelte';
	import { ChevronDown, ChevronRight, ChevronUp } from 'lucide-svelte';
	import {
		saveNodeAndInsertNode
	} from 'src/view/actions/keyboard-shortcuts/helpers/commands/commands/helpers/save-node-and-insert-node';
	import { Direction } from 'src/stores/view/view-store-actions';

	export let position: Direction;
    const plugin = getPlugin();
    // eslint-disable-next-line no-undef
    const createCard = (e: MouseEvent) => {
        e.stopPropagation();
        saveNodeAndInsertNode(plugin, position);
    };
    const chevrons = {
        right: ChevronRight,
        up: ChevronUp,
        down: ChevronDown,
    };
</script>

<FloatingButton on:click={createCard} {position}>
    <svelte:component this={chevrons[position]}></svelte:component>
</FloatingButton>

<style>
</style>
