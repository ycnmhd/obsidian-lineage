<script lang="ts">
	import { PencilIcon, SaveIcon } from 'lucide-svelte';
	import { getStore } from '../../../../../../../get-store';
	import FloatingButton from './floating-button.svelte';

	export let editing: boolean;
    const store = getStore();
	// eslint-disable-next-line no-undef
    const toggleEdit = (e: MouseEvent) => {
        e.stopPropagation();
        if (editing) {
            store.dispatch({
                type: 'DISABLE_EDIT_MODE',
                payload: {
                    save: true,
                },
            });
        } else {
            store.dispatch({
                type: 'ENABLE_EDIT_MODE',
            });
        }
    };
</script>

<FloatingButton on:click={toggleEdit} position={'bottom-right'}>
    {#if editing}
        <SaveIcon class="svg-con" />
    {:else}
        <PencilIcon class="svg-icon" />
    {/if}
</FloatingButton>
