<script lang="ts">
	import { NodeDirection } from '../../../../../../../../../../stores/document/document-reducer';
	import { getStore } from '../../../../../../../get-store';
	import FloatingButton from './floating-button.svelte';
	import { PlusIcon } from 'lucide-svelte';

	export let position: NodeDirection;
    const store = getStore();
    const createCard = (e: MouseEvent) => {
        e.stopPropagation();
        store.dispatch({
            type: 'CREATE_NODE',
            payload: {  position },
        });
    };
</script>

<FloatingButton on:click={createCard} {position}><PlusIcon /></FloatingButton>

<style>
</style>
