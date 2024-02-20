<script lang="ts">
	import { documentStore, NodeGroup } from 'src/view/store/document.store';
	import Node from './components/card/card.svelte';
	import { ActiveStatus } from 'src/view/components/container/column/components/group/components/active-status.enum';

	export let group: NodeGroup;
</script>

<div class="group" id={group.id}>
    {#each group.nodes as node (node.id)}
        <Node
            {node}
            active={node.id === $documentStore.state.activeBranch.node
                ? ActiveStatus.node
                : $documentStore.state.activeBranch.parentNodes.has(node.id)
                ? ActiveStatus.parent
                : $documentStore.state.activeBranch.childNodes.has(node.id)
                ? ActiveStatus.child
                : $documentStore.state.activeBranch.siblingNodes.has(node.id)
                ? ActiveStatus.sibling
                : null}
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
