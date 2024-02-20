<script lang="ts">
	import { PencilIcon, SaveIcon } from 'lucide-svelte';
	import { getStore } from 'src/view/components/container/ref';

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

<button on:click={toggleEdit}>
    {#if editing}
        <SaveIcon class="svg-con" />
    {:else}
        <PencilIcon class="svg-icon" />
    {/if}
</button>

<style>
    :root {
        --width: 30px;
        --height: 10px;
    }
    button {
        width: var(--width);
        height: var(--height);
        position: absolute;
        opacity: 0.5;
        bottom: 0;
        right: 0;
    }
    button:hover {
        opacity: 1;
    }
</style>
