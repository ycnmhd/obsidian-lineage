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
        store.dispatch({
            type: 'SET_ACTIVE_NODE',
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
        store.dispatch({ type: 'ENABLE_EDIT_MODE' });
    }}
    use:droppable={store}
>
    <slot />
    <Bridges {active} {editing} {hasChildren} {parentId} />
</div>

<style>
    :root {
        --border: 10px #5acf5a solid;
        --border-shadow-top: 0 -5px 15px -5px rgba(90, 207, 90, 0.79);
        --border-shadow-right: 5px 0 15px -5px rgba(90, 207, 90, 0.79);
        --border-shadow-bottom: 0 5px 15px -5px rgba(90, 207, 90, 0.79);
    }

    :global(.drop-node-above) {
        border-bottom: none;
        border-right: none;
        border-top: var(--border);
        box-shadow: var(--border-shadow-top);
    }
    :global(.drop-node-below) {
        border-top: none;
        border-right: none;
        border-bottom: var(--border);
        box-shadow: var(--border-shadow-bottom);
    }
    :global(.drop-node-under) {
        border-top: none;
        border-bottom: none;
        border-right: var(--border);
        box-shadow: var(--border-shadow-right);
    }
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
        border-left: 5px #55b1ae solid;
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
