<script lang="ts">
	import { NodeGroup } from 'src/stores/document/document-type';
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
            $store.document.state.activeBranch.childGroups.has(group.parentId) &&
                'group-has-active-parent',
            $store.document.state.activeBranch.group === group.parentId &&
                'group-has-active-node',
        )}
        id={"group-"+group.parentId}
    >
        {#each group.nodes as node (node)}
            <Node
                {node}
                active={node === $store.document.state.activeBranch.node
                    ? ActiveStatus.node
                    : $store.document.state.activeBranch.parentNodes.has(node)
                    ? ActiveStatus.parent
                    : $store.document.state.activeBranch.childNodes.has(node)
                    ? ActiveStatus.child
                    : $store.document.state.activeBranch.siblingNodes.has(node)
                    ? ActiveStatus.sibling
                    : null}
                editing={$store.document.state.editing.activeNodeId === node}
                hasChildren={$store.document.state.activeBranch.childNodes.size > 0}
                parentId={group.parentId}
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
