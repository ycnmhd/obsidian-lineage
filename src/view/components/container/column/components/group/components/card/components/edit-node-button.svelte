<script lang="ts">
	import { documentStore } from 'src/view/store/document.store';
	import { PencilIcon, SaveIcon } from 'lucide-svelte';

	export let nodeId: string;
    export let editing: boolean;

    const toggleEdit = (e: MouseEvent) => {
        e.stopPropagation();
        documentStore.dispatch({
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
