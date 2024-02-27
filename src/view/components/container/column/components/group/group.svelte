<script lang="ts">
	import { NodeGroup } from 'src/stores/document/document-reducer';
	import Node from './components/card/card.svelte';
	import { ActiveStatus } from 'src/view/components/container/column/components/group/components/active-status.enum';
	import { getStore } from 'src/view/components/container/context';
	import clx from 'classnames';

	const store = getStore();
    export let group: NodeGroup;
</script>

{#if group.nodes.length > 0}
    <div
        class={clx(
            'group',
            $store.state.activeBranch.childGroups.has(group.id) &&
                'group-has-active-parent',
            $store.state.activeBranch.group === group.id &&
                'group-has-active-node',
        )}
        id={group.id}
    >
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
                editing={$store.state.editing.activeNodeId === node.id}
                hasChildren={$store.state.activeBranch.childNodes.size > 0}
                parentId={node.parentId}
            />
        {/each}
    </div>
{/if}

<style>
    .group {
        display: flex;
        flex-direction: column;
        width: fit-content;
        background-color: var(--background-color-inactive-node);
        gap: var(--node-gap);
        padding: 8px;
    }
    .group:last-child {
        margin-bottom: 0;
    }
    .group-has-active-node {
        background-color: var(--background-active-parent);
    }
    .group-has-active-parent {
        background-color: var(--background-active-node);
        border-bottom-left-radius: 6px;
        border-top-left-radius: 6px;
    }
</style>
