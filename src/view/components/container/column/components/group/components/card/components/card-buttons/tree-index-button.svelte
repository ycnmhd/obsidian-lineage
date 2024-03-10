<script lang="ts">
    import { getStore } from '../../../../../../../context';
    import { ActiveStatus } from 'src/view/components/container/column/components/group/components/active-status.enum';

    const store = getStore();
    export let nodeId: string;
    export let activeStatus: ActiveStatus | null;
    // eslint-disable-next-line no-undef
    const deleteNode = (e: MouseEvent) => {};
    const classes: Partial<Record<ActiveStatus, string>> = {
        [ActiveStatus.node]: 'is-active',
        [ActiveStatus.child]: 'is-active-child',
        [ActiveStatus.parent]: 'is-active-parent',
        [ActiveStatus.sibling]: 'is-active-parent',
    };
</script>

<div
    class={'tree-index ' + (activeStatus ? classes[activeStatus] : '')}
    on:click={deleteNode}
>
    {$store.ui.treeIndex[nodeId]}
</div>

<style>
    .tree-index {
        position: absolute;
        bottom: 3px;
        right: 8px;
        opacity: 0.8;
        font-size: 12px;
    }
    .is-active {
        right: 22px;
        opacity: 0.3;
    }

    .is-active-child {
        opacity: 0.3;
    }

    .is-active-parent {
        opacity: 0.6;
    }
</style>
