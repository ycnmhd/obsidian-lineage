<script lang="ts">
	import { PencilIcon, SaveIcon } from 'lucide-svelte';
	import { getStore } from 'src/view/components/container/ref';
	import FloatingButton from './floating-button.svelte';

	export let nodeId: string;
    export let editing: boolean;
	const store = getStore()
    const toggleEdit = (e: MouseEvent) => {
        e.stopPropagation();
        store.dispatch({
            type: 'TOGGLE_EDIT_NODE',
            payload: { nodeId },
        });
    };
</script>

<FloatingButton on:click={toggleEdit} position={"bottom-right"}>
    {#if editing}
        <SaveIcon class="svg-con" />
    {:else}
        <PencilIcon class="svg-icon" />
    {/if}
</FloatingButton>



