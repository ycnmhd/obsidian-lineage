<script lang="ts">
    import { getStore } from '../../../../../../../context';
    import { droppable } from 'src/view/actions/dnd/droppable';
    import { ActiveStatus } from 'src/view/components/container/column/components/group/components/active-status.enum';
    import Bridges from '../bridges/bridges.svelte';
    import clx from 'classnames';

    export let nodeId: string;
    export let active: ActiveStatus | null;
    export let hasChildren: boolean;
    export let parentId: string;
    export let editing: boolean;

    const setActive = () => {
        if (!editing)
            store.dispatch({
                type: 'DOCUMENT/SET_ACTIVE_NODE',
                payload: { id: nodeId },
            });
    };
    const store = getStore();
    const activeStatusClasses = {
        [ActiveStatus.node]: 'active-node',
        [ActiveStatus.child]: 'active-child',
        [ActiveStatus.parent]: 'active-parent',
        [ActiveStatus.sibling]: 'active-sibling',
    };
</script>

<div
    class={clx('lineage__card', 'node', active && activeStatusClasses[active])}
    id={nodeId}
    on:click={setActive}
    on:dblclick={() => {
        setActive();
        store.dispatch({ type: 'DOCUMENT/ENABLE_EDIT_MODE' });
    }}
    use:droppable={store}
>
    <slot />
    <Bridges {active} {editing} {hasChildren} {parentId} />
</div>

<style>
    .node {
        width: var(--node-width);
        height: fit-content;
        display: flex;
        position: relative;
        background-color: var(--background-color-inactive-node);
        color: var(--color-inactive-node);
        font-size: 16px;
    }

    .active-node,
    .active-child {
        color: var(--color-active-node);
        background-color: var(--background-active-node);
    }

    .active-node {
        border-left: 5px var(--lineage-accent) solid;
    }
    .active-child:hover {
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .active-parent,
    .active-sibling {
        color: var(--color-active-child);
        background-color: var(--background-active-parent);
    }
</style>
