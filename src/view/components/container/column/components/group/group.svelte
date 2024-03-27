<script lang="ts">
    import { NodeGroup, NodeId } from 'src/stores/document/document-state-type';
    import Node from './components/card/card.svelte';
    import { ActiveStatus } from 'src/view/components/container/column/components/group/components/active-status.enum';
    import { getView } from 'src/view/components/container/context';
    import clx from 'classnames';

    const view = getView();
    const viewStore = view.viewStore
    export let group: NodeGroup;
    let parentNodes: Set<NodeId> = new Set<NodeId>();
    $: parentNodes = new Set($viewStore.document.activeBranch.sortedParentNodes);
</script>

{#if group.nodes.length > 0 && ($viewStore.search.query.length === 0 || group.nodes.some( (n) => $viewStore.search.results.has(n), ))}
    <div
        class={clx(
            'group',
            $viewStore.document.activeBranch.childGroups.has(group.parentId) &&
                'group-has-active-parent',
            $viewStore.document.activeBranch.group === group.parentId &&
                'group-has-active-node',
        )}
        id={'group-' + group.parentId}
    >
        {#each group.nodes as node (node)}
            {#if $viewStore.search.query.length === 0 || (!$viewStore.search.searching && $viewStore.search.results.has(node))}
                <Node
                    {node}
                    active={node === $viewStore.document.activeNode
                        ? ActiveStatus.node
                        : parentNodes.has(node)
                          ? ActiveStatus.parent
                          : $viewStore.document.activeBranch.childGroups.has(
                                  group.parentId,
                              )
                            ? ActiveStatus.child
                            : $viewStore.document.activeBranch.group ===
                                group.parentId
                              ? ActiveStatus.sibling
                              : null}
                    editing={$viewStore.document.editing.activeNodeId === node}
                    hasChildren={$viewStore.document.activeBranch.childGroups.size >
                        0}
                    parentId={group.parentId}
                />
            {/if}
        {/each}
    </div>
{/if}

<style>
    .group {
        display: flex;
        flex-direction: column;
        width: fit-content;
        gap: 4px;
        padding: 8px;
    }
    .group:last-child {
        margin-bottom: 0;
    }
    .group-has-active-node {
    }
    .group-has-active-parent {
        border-bottom-left-radius: 6px;
        border-top-left-radius: 6px;
    }
</style>
