<script lang="ts">
	import CreateCardButton from './components/create-card-button.svelte';
	import EditNodeButton from './components/edit-node-button.svelte';
	import { documentStore, MatrixNode } from 'src/view/store/document.store';
	import clx from 'classnames';
	import { ActiveStatus } from 'src/view/components/container/column/components/group/components/active-status.enum';

	export let node: MatrixNode;
    export let active: ActiveStatus | null;
    export let editing: boolean;

    const activeStatusClasses = {
        [ActiveStatus.node]: 'active-node',
        [ActiveStatus.child]: 'active-child',
        [ActiveStatus.parent]: 'active-parent',
        [ActiveStatus.sibling]: 'active-sibling',
    };

    const setActive = () => {
        documentStore.dispatch({
            type: 'SET_ACTIVE',
            payload: { id: node.id },
        });
    };
    let textAreaRef: HTMLTextAreaElement | null;
    let wasEditing = false;
    $: {
        if (editing) {
            if (textAreaRef) textAreaRef.value = node.content;
            wasEditing = true;
        } else {
            if (wasEditing)
                documentStore.dispatch({
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
>
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
        <EditNodeButton
            nodeId={node.id}
            {editing}
        />
    {/if}
    {#if editing}
        <textarea bind:this={textAreaRef}> </textarea>
    {:else}
        <span class="content">{node.content}</span>
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
</style>
