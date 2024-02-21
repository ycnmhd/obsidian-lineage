<script lang="ts">
	import { NodeGroup } from 'src/view/store/document-reducer';
	import Node from './components/card/card.svelte';
	import { ActiveStatus } from 'src/view/components/container/column/components/group/components/active-status.enum';
	import { getStore } from 'src/view/components/container/ref';

	const store = getStore();
    export let group: NodeGroup;
</script>

<div class="group" id={group.id}>
    {#each group.nodes as node (node.id)}
        <Node
            {node}
            active={node.id === $store.state.activeBranch.node
                ? ActiveStatus.node
                : $store.state.activeBranch.parentNodes.has(node.id)
                ? ActiveStatus.parent
                : $store.state.activeBranch.childNodes.has(node.id)
                ? ActiveStatus.child
                : $store.state.activeBranch.siblingNodes.has(node.id)
                ? ActiveStatus.sibling
                : null}
            editing={$store.state.editing.node === node.id}
        />
    {/each}
</div>

<style>
    .group {
        display: flex;
        flex-direction: column;
        width: var(--node-width);
        background-color: transparent;
    }
</style>
