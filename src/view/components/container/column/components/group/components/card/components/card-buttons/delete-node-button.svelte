<script lang="ts">
    import { TrashIcon } from 'lucide-svelte';
    import { getView } from '../../../../../../../context';
    import FloatingButton from './floating-button.svelte';

    export let nodeId: string
    const view = getView();
    const documentStore = view.documentStore;
    // eslint-disable-next-line no-undef
    const deleteNode = (e: MouseEvent) => {
        e.stopPropagation();
        documentStore.dispatch({
            type: 'DOCUMENT/DELETE_NODE',
            payload: {
                activeNodeId:nodeId,
            },
        });
    };
</script>

<FloatingButton label={'Delete'} on:click={deleteNode} position={'up-right'}>
    <TrashIcon class="svg-con" />
</FloatingButton>
