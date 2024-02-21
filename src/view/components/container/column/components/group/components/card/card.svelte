<script lang="ts">
	import CreateCardButton from './components/create-card-button.svelte';
	import EditNodeButton from './components/edit-node-button.svelte';
	import { MatrixNode } from 'src/view/store/document-reducer';
	import clx from 'classnames';
	import { ActiveStatus } from 'src/view/components/container/column/components/group/components/active-status.enum';
	import { getStore } from 'src/view/components/container/ref';
	import { draggable } from 'src/view/actions/dnd/draggable';
	import { droppable } from 'src/view/actions/dnd/droppable';

	export let node: MatrixNode;
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
            type: 'SET_ACTIVE',
            payload: { id: node.id },
        });
    };
	// eslint-disable-next-line no-undef
    let textAreaRef: HTMLTextAreaElement | null;
    let wasEditing = false;
    $: {
        if (editing) {
            if (textAreaRef) textAreaRef.value = node.content;
            wasEditing = true;
        } else {
            if (wasEditing)
                store.dispatch({
                    type: 'SET_NODE_CONTENT',
                    payload: {
                        nodeId: node.id,
                        content: textAreaRef?.value || '',
                    },
                });
            wasEditing = false;
        }
    }
</script>

<div
    class={clx('node', active && activeStatusClasses[active])}
    id={node.id}
    on:click={setActive}
    use:droppable={store}
>
    {#if editing}
        <textarea bind:this={textAreaRef}> </textarea>
    {:else}
        <div class="content" use:draggable={{ id: node.id, store }}>
            <div class="drag-handle"></div>
            <span>
                {node.content}
            </span>
        </div>
    {/if}
    {#if active === ActiveStatus.node}
        <CreateCardButton
            nodeId={node.id}
            parentId={node.parentId}
            position="top"
        ></CreateCardButton>
        <CreateCardButton
            nodeId={node.id}
            parentId={node.parentId}
            position="right"
        ></CreateCardButton>
        <CreateCardButton
            nodeId={node.id}
            parentId={node.parentId}
            position="bottom"
        ></CreateCardButton>
        <EditNodeButton nodeId={node.id} {editing} />
    {/if}
</div>

<style>
    .node {
        width: var(--node-width);
        height: 100px;
        background-color: var(--node-bg);
        padding: 5px;
        position: relative;
        border-radius: 5px;
        display: flex;
    }

    .active-node {
        background-color: var(--parent-bg);
    }
    .active-node textarea,
    .active-node .content {
        background-color: var(--node-bg-active);
    }
    .active-child {
        background-color: var(--node-bg-active);
    }

    .active-parent,
    .active-sibling {
        background-color: var(--parent-bg);
    }
    textarea {
        width: 100%;
        height: 100%;
        color: black;
        border: none;
        outline: none;
        border-radius: 5px;
        background-color: transparent;
        display: block;
        resize: none;
        overflow: hidden;
        font-size: 16px;
        font-family: monospace;
    }
    textarea:focus {
        border: none;
        outline: none !important;
    }
    .content {
        width: 100%;
        height: 100%;
        color: black;
        border-radius: 5px;
        background-color: transparent;
        display: block;
        overflow: hidden;
        font-size: 16px;
        font-family: monospace;
    }
    .active-node .content {
        border-left: 5px #5acf5a solid;
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
</style>
