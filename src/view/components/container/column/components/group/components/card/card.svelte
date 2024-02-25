<script lang="ts">
	import CreateCardButton from './components/create-card-button.svelte';
	import EditNodeButton from './components/edit-node-button.svelte';
	import DeleteNodeButton from './components/delete-node-button.svelte';
	import { ColumnNode } from 'src/stores/document/document-reducer';
	import clx from 'classnames';
	import { ActiveStatus } from 'src/view/components/container/column/components/group/components/active-status.enum';
	import { getStore } from 'src/view/components/container/get-store';
	import { draggable } from 'src/view/actions/dnd/draggable';
	import { droppable } from 'src/view/actions/dnd/droppable';
	import {
		saveNodeContent
	} from 'src/view/components/container/column/components/group/components/card/actions/save-node-content';
	import {
		expandableTextareaAction
	} from 'src/view/components/container/column/components/group/components/card/actions/expandable-textarea-action';

	export let node: ColumnNode;
    export let active: ActiveStatus | null;
    export let editing: boolean;

    const activeStatusClasses = {
        [ActiveStatus.node]: 'active-node',
        [ActiveStatus.child]: 'active-child',
        [ActiveStatus.parent]: 'active-parent',
        [ActiveStatus.sibling]: 'active-sibling',
    };

    const store = getStore();

    const setActive = () => {
        store.dispatch({
            type: 'SET_ACTIVE_NODE',
            payload: { id: node.id },
        });
    };
</script>

<div
    class={clx('node', active && activeStatusClasses[active])}
    id={node.id}
    on:click={setActive}
    use:droppable={store}
>
    {#if editing}
        <textarea use:saveNodeContent={{ editing, store, node }} use:expandableTextareaAction/>
    {:else}
        <div class="content-wrapper" use:draggable={{ id: node.id, store }}>
            <div class="drag-handle"></div>
            <div
                on:dblclick={() => {
                    store.dispatch({ type: 'ENABLE_EDIT_MODE' });
                }}
				class="content"
            >
                {#each node.content.split('\n') as line}
                    <span>{line}</span><br />
                {/each}
            </div>
        </div>
    {/if}
    {#if active === ActiveStatus.node}
        {#if !editing}
            <CreateCardButton position="top" />
            <CreateCardButton position="right" />
            <CreateCardButton position="bottom" />
            <DeleteNodeButton />
        {/if}
        <EditNodeButton {editing} />
    {/if}
</div>

<style>
	:root{
		--padding: 6px;
		--border-radius: 6px;
		--min-height: 100px;
		--font-size: 16px;
		--text-color: black;
	}
    .node {
        width: var(--node-width);
		height: fit-content;
        background-color: var(--node-bg);
        padding: var(--padding);
        border-radius: var(--border-radius);
		position: relative;
        display: flex;
    }


    textarea {
        width: 100%;
		min-height: var(--min-height);
		padding: var(--padding) ;

		border-radius: var(--border-radius);
        color: var(--text-color);
        background-color: transparent;
        display: block;
        resize: none;
        /*overflow: hidden;*/
		font-size:  var(--font-size);
        font-family: monospace;
        border: none;
        outline: none;
    }
    textarea:focus {
        border: none;
        outline: none !important;
    }
    .content-wrapper {
		width: 100%;
		border-radius: var(--border-radius);
        background-color: transparent;
        display: flex;

    }

	.content{
		width: 100%;
		min-height: var(--min-height);
		padding: var(--padding);
		border-radius: var(--border-radius);
        overflow: hidden;
		color: var(--text-color);
        font-size:  var(--font-size);
        font-family: monospace;

	}

	.active-node .content-wrapper {
		border-left: 6px #5acf5a solid;
	}

	/*DND*/
    :root {
        --border: 10px #5acf5a solid;
        --border-shadow-top: 0 -5px 15px -5px rgba(90, 207, 90, 0.79);
        --border-shadow-right: 5px 0 15px -5px rgba(90, 207, 90, 0.79);
        --border-shadow-bottom: 0 5px 15px -5px rgba(90, 207, 90, 0.79);
    }

	.drag-handle {
		height: 100%;
		width: 8px;
		background-color: transparent;
		cursor: grab;
	}
	.node:hover .drag-handle {
		background-size: 2px 4px;
		background-image: linear-gradient(
			0deg,
			hsla(0, 0%, 44.7%, 0.25) 20%,
			transparent 50%
		);
	}
	.active-node {
		background-color: var(--parent-bg);
	}
	.active-node textarea,
	.active-node .content-wrapper {
		background-color: var(--node-bg-active);
	}
	.active-child {
		background-color: var(--node-bg-active);
	}

	.active-parent,
	.active-sibling {
		background-color: var(--parent-bg);
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
</style>
