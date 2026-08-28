<script lang="ts">
    import { getView } from 'src/view/components/container/context';
    import Node from 'src/view/components/container/column/components/group/components/card/card.svelte';
    import { documentStateStore } from 'src/stores/view/derived/editing-store';
    import { activeNodeStore } from 'src/stores/view/derived/active-node-store';
    import { activeBranchStore } from 'src/stores/view/derived/active-branch-store';
    import { selectedNodesStore } from 'src/stores/view/derived/selected-nodes-store';
    import { searchStore } from 'src/stores/view/derived/search-store';
    import { IdSectionStore } from 'src/stores/document/derived/id-section-store';
    import { GroupParentIdsStore } from 'src/stores/document/derived/meta';
    import { PinnedNodesStore } from 'src/stores/document/derived/pinned-nodes-store';
    import { PendingConfirmationStore } from 'src/stores/view/derived/pending-confirmation';
    import { NodeStylesStore } from 'src/stores/view/derived/style-rules';
    import { zoomLevelStore } from 'src/stores/view/derived/zoom-level-store';
    import { AlwaysShowCardButtons } from 'src/stores/settings/derived/view-settings-store';
    import ConnectionsSvg from './connections-svg.svelte';
    import { calculateMindmapPositions, MindmapLayout } from './helpers/calculate-positions';
    import { onMount, onDestroy } from 'svelte';
    import { NodeId } from 'src/stores/document/document-state-type';
    import { ActiveStatus } from 'src/view/components/container/column/components/group/components/active-status.enum';
    import { droppable } from 'src/view/actions/dnd/droppable';

    export let limitPreviewHeight: boolean;
    export let applyGap: boolean;

    const view = getView();

    const editing = documentStateStore(view);
    const activeNode = activeNodeStore(view);
    const activeBranch = activeBranchStore(view);
    const selectedNodes = selectedNodesStore(view);
    const search = searchStore(view);
    const idSection = IdSectionStore(view);
    const groupParentIds = GroupParentIdsStore(view);
    const pinnedNodesArray = PinnedNodesStore(view);
    const pendingConfirmation = PendingConfirmationStore(view);
    const styleRules = NodeStylesStore(view);
    const zoom = zoomLevelStore(view);
    const alwaysShowCardButtons = AlwaysShowCardButtons(view);

    let containerRef: HTMLElement | null = null;
    let layout: MindmapLayout = { positions: new Map(), connections: [] };
    $: pinnedNodes = new Set<string>($pinnedNodesArray);

    let parentNodes: Set<NodeId> = new Set();
    let activeChildGroups: Set<string> = new Set();
    $: parentNodes = new Set($activeBranch.sortedParentNodes);
    $: activeChildGroups = $activeBranch.childGroups;

    function recalculateLayout() {
        if (!containerRef) return;

        const rect = containerRef.getBoundingClientRect();
        const document = view.documentStore.getValue().document;
        const cardWidth = view.plugin.settings.getValue().view.cardWidth;
        const cardHeight = 150; // approximate

        layout = calculateMindmapPositions(
            document,
            rect.width,
            rect.height,
            cardWidth,
            cardHeight,
        );
    }

    $: if ($editing || $activeNode || $groupParentIds || $zoom) {
        recalculateLayout();
    }

    onMount(() => {
        recalculateLayout();
        window.addEventListener('resize', recalculateLayout);
    });

    onDestroy(() => {
        window.removeEventListener('resize', recalculateLayout);
    });

    function getNodePosition(nodeId: string) {
        return layout.positions.get(nodeId);
    }

    function getActiveStatus(node: string) {
        if (node === $activeNode) return ActiveStatus.node;
        if (parentNodes.has(node)) return ActiveStatus.parent;
        if (activeChildGroups.has(node)) return ActiveStatus.child;
        return ActiveStatus.sibling;
    }
</script>

<div
    bind:this={containerRef}
    class="mindmap-container"
    class:limit-card-height={limitPreviewHeight}
    class:gap-between-cards={applyGap}
    class:zoom-enabled={$zoom !== 1}
    id="mindmap-container"
>
    <ConnectionsSvg
        {containerRef}
        positions={layout.positions}
        connections={layout.connections}
        activeNode={$activeNode}
        parentNodes={parentNodes}
        childGroups={activeChildGroups}
        zoom={$zoom}
    />

    {#each Array.from(layout.positions.values()) as pos}
        {#if $search.query.length === 0 || $search.showAllNodes || (!$search.searching && $search.results.has(pos.nodeId))}
            <div
                class="mindmap-card-wrapper"
                style="transform: translate({pos.x}px, {pos.y}px); z-index: {pos.depth};"
                id={pos.nodeId}
                use:droppable
            >
                <Node
                    node={pos.nodeId}
                    active={getActiveStatus(pos.nodeId)}
                    editing={$editing.activeNodeId === pos.nodeId && !$editing.isInSidebar}
                    confirmDisableEdit={$editing.activeNodeId === pos.nodeId &&
                        $pendingConfirmation.disableEdit === pos.nodeId &&
                        !$editing.isInSidebar}
                    confirmDelete={$pendingConfirmation.deleteNode.has(pos.nodeId)}
                    hasActiveChildren={activeChildGroups.size > 0}
                    hasChildren={$groupParentIds.has(pos.nodeId)}
                    section={$idSection[pos.nodeId]}
                    selected={$selectedNodes.has(pos.nodeId)}
                    pinned={pinnedNodes.has(pos.nodeId)}
                    isSearchMatch={$search.results.has(pos.nodeId)}
                    firstColumn={pos.depth === 0}
                    style={$styleRules.get(pos.nodeId)}
                    outlineMode={false}
                    collapsed={false}
                    hidden={false}
                    alwaysShowCardButtons={$alwaysShowCardButtons}
                />
            </div>
        {/if}
    {/each}
</div>

<style>
    .mindmap-container {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: auto;
        --scrollbar-thumb-bg: transparent;
        --scrollbar-active-thumb-bg: transparent;
        --scrollbar-bg: transparent;
    }

    .mindmap-container::-webkit-scrollbar {
        display: none;
    }

    .mindmap-card-wrapper {
        position: absolute;
        transition: transform 0.3s ease;
    }

    .mindmap-card-wrapper:hover {
        z-index: 100 !important;
    }
</style>
