<script lang="ts">
    import { getView } from '../../../../../../../context';
    import FloatingButton from './floating-button.svelte';
    import { ChevronDown, ChevronRight, ChevronUp } from 'lucide-svelte';
    import {
        saveNodeAndInsertNode
    } from 'src/view/actions/keyboard-shortcuts/helpers/commands/commands/helpers/save-node-and-insert-node';
    import { Direction } from 'src/stores/document/document-store-actions';

    export let position: Direction;
    const view = getView();
    // eslint-disable-next-line no-undef
    const createCard = (e: MouseEvent) => {
        e.stopPropagation();
        saveNodeAndInsertNode(view, position);
    };
    const chevrons = {
        right: ChevronRight,
        up: ChevronUp,
        down: ChevronDown,
    };
    const label: Record<Direction, string> = {
        "up":"Add card above",
        "down":"Add card below",
        "right":"Add child card"
    }
</script>

<FloatingButton label={label[position]} on:click={createCard} {position}>
    <svelte:component this={chevrons[position]}></svelte:component>
</FloatingButton>

<style>
</style>
