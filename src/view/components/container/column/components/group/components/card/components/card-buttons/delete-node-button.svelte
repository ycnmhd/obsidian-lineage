<script lang="ts">
        import { TrashIcon } from 'lucide-svelte';
        import { getStore } from '../../../../../../../context';
        import FloatingButton from './floating-button.svelte';

        const store = getStore();
    // eslint-disable-next-line no-undef
    const deleteNode = (e: MouseEvent) => {
        e.stopPropagation();
        store.dispatch({
            type: 'DOCUMENT/DELETE_NODE',
        });
    };
</script>

<FloatingButton label={"Delete"} on:click={deleteNode} position={'up-right'}>
        <TrashIcon class="svg-con" />
</FloatingButton>
