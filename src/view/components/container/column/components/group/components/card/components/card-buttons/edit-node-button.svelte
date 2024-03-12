<script lang="ts">
    import { PencilIcon, SaveIcon } from 'lucide-svelte';
    import { getStore, getView } from '../../../../../../../context';
    import FloatingButton from './floating-button.svelte';
    import {
        saveNodeContent
    } from 'src/view/actions/keyboard-shortcuts/helpers/commands/commands/helpers/save-node-content';

    export let editing: boolean;
    const store = getStore();
    const view = getView()
    // eslint-disable-next-line no-undef
    const toggleEdit = (e: MouseEvent) => {
        e.stopPropagation();
        if (editing) {
            saveNodeContent(view);
        } else {
            store.dispatch({
                type: 'DOCUMENT/ENABLE_EDIT_MODE',
            });
        }
    };
</script>

<FloatingButton on:click={toggleEdit} position={'down-right'}>
    {#if editing}
        <SaveIcon class="svg-con" />
    {:else}
        <PencilIcon class="svg-icon" />
    {/if}
</FloatingButton>
