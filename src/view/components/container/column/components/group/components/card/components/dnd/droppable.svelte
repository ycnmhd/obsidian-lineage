<script lang="ts">
	import { getStore } from '../../../../../../../get-store';
	import { droppable } from 'src/view/actions/dnd/droppable';
	import { ActiveStatus } from 'src/view/components/container/column/components/group/components/active-status.enum';
	import clx from 'classnames';

	export let nodeId: string;
    export let active: ActiveStatus | null;

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
    class={clx('node', active && activeStatusClasses[active])}
    id={nodeId}
    on:click={setActive}
    use:droppable={store}
>
    <slot />
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
		background-color: #1c1e25;
		color: #525252;
        border-radius: var(--radius-m);
        overflow: hidden;
		font-size: 16px;
    }

    .active-node,
    .active-child {
		color: white;
        background-color: #363e52;
    }

    .active-parent,
    .active-sibling {
		color: white;
        background-color: #252934;
    }

</style>
