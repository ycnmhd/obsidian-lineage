<script lang="ts">
    import { PencilIcon, SaveIcon } from 'lucide-svelte';
    import { getView } from '../../../../../../../context';
    import FloatingButton from './floating-button.svelte';
    import {
        saveNodeContent
    } from 'src/view/actions/keyboard-shortcuts/helpers/commands/commands/helpers/save-node-content';

    export let editing: boolean;
    export let nodeId: string;
    const view = getView();
    const viewStore = view.viewStore;
    // eslint-disable-next-line no-undef
    const toggleEdit = (e: MouseEvent) => {
        e.stopPropagation();
        if (editing) {
            saveNodeContent(view);
        } else {
            viewStore.dispatch({
                type: 'DOCUMENT/ENABLE_EDIT_MODE',
                payload: {
                    nodeId,
                },
            });
        }
    };
</script>

<FloatingButton
    label={editing ? 'Save' : 'Edit'}
    on:click={toggleEdit}
    position={'down-right'}
>
    {#if editing}
        <SaveIcon class="svg-con" />
    {:else}
        <PencilIcon class="svg-icon" />
    {/if}
</FloatingButton>
