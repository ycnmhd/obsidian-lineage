<script lang="ts">
    import { setContext } from 'svelte';
    import { TFile } from 'obsidian';
    import Lineage from 'src/main';
    import Node from 'src/view/components/container/column/components/group/components/card/card.svelte';
    import { ActiveStatus } from 'src/view/components/container/column/components/group/components/active-status.enum';
    import { VirtualLineageView } from '../../helpers/create-virtual-view';
    import { GlobalCardNavItem } from '../../helpers/global-view-keyboard';
    import { NodeStylesStore } from 'src/stores/view/derived/style-rules';
    import { LineageView } from 'src/view/view';    import { renderContextMenu } from 'src/obsidian/context-menu/render-context-menu';
    import { lang } from 'src/lang/lang';
    import { openCardInLineage } from '../../helpers/open-card-in-lineage';
    import { copyLinkToBlock } from 'src/view/actions/context-menu/card-context-menu/helpers/copy-link-to-block';
    import { ResolvedGlobalCard } from '../../helpers/tree-utils';
    import { ArrowDown, ArrowUp } from 'lucide-svelte';

    export let plugin: Lineage;
    export let virtualView: VirtualLineageView;
    export let cards: ResolvedGlobalCard[];
    export let file: TFile;
    export let onRemoveCard: (card: ResolvedGlobalCard) => void;
    export let onMoveCard: (card: ResolvedGlobalCard, delta: number) => void;
    export let onResolvedCards: (
        filePath: string,
        items: GlobalCardNavItem[],
    ) => void;

    setContext('plugin', plugin);
    // The card subtree reads `getView()` from svelte context; bind it to the
    // virtual view so inline editing and links operate on this file's store.
    setContext('view', virtualView as unknown as LineageView);

    const viewStore = virtualView.viewStore;
    const styleRules = NodeStylesStore(
        virtualView as unknown as LineageView,
    );

    // Reuse the shared view store's search state to filter the rendered cards
    // (same semantics as the main lineage view: no query → all; showAllNodes
    // → all; otherwise only nodes that are in the search results).
    $: searchQuery = $viewStore.search.query;
    $: searchShowAllNodes = $viewStore.search.showAllNodes;
    $: searchResults = $viewStore.search.results;

    $: resolved = cards
        .map((c) => ({
            ...c,
            nodeId:
                virtualView.documentStore.getValue().sections.section_id[
                    c.section
                ],
        }))
        .filter((c): c is ResolvedGlobalCard & { nodeId: string } =>
            Boolean(c.nodeId),
        )
        .filter(
            (c) =>
                !searchQuery ||
                searchShowAllNodes ||
                searchResults.has(c.nodeId),
        );

    // Keep the global keyboard navigation list in sync with this file group
    $: onResolvedCards(
        file.path,
        resolved.map((c) => ({
            filePath: file.path,
            nodeId: c.nodeId,
            section: c.section,
            categoryId: c.categoryId,
        })),
    );

    $: activeNodeId =
        $viewStore.pinnedNodes.activeNode ||
        $viewStore.recentNodes.activeNode;
    $: editing = $viewStore.document.editing;
    $: pending = $viewStore.document.pendingConfirmation;

    const onCardContextMenu = (
        e: MouseEvent,
        card: ResolvedGlobalCard & { nodeId: string },
    ) => {
        e.preventDefault();
        e.stopPropagation();
        virtualView.viewStore.dispatch({
            type: 'view/pinned-nodes/set-active-node',
            payload: { id: card.nodeId },
        });
        virtualView.viewStore.dispatch({
            type: 'view/recent-nodes/set-active-node',
            payload: { id: card.nodeId },
        });
        const items: Parameters<typeof renderContextMenu>[1] = [
            {
                title: lang.cm_open_in_lineage,
                icon: 'link',
                action: () => openCardInLineage(plugin, file, card.section),
            },
            { type: 'separator' },
            {
                title: lang.global_categories_move_up,
                icon: 'arrow-up',
                action: () => onMoveCard(card, -1),
            },
            {
                title: lang.global_categories_move_down,
                icon: 'arrow-down',
                action: () => onMoveCard(card, 1),
            },
            { type: 'separator' },
            {
                title: lang.cm_copy_link_to_block,
                icon: 'links-coming-in',
                action: () =>
                    copyLinkToBlock(
                        virtualView as unknown as LineageView,
                        true,
                    ),
            },
            { type: 'separator' },
            {
                title: lang.cm_remove_from_category,
                icon: 'trash-2',
                dangerous: true,
                action: () => onRemoveCard(card),
            },
        ];
        renderContextMenu(e, items);
    };

    const onDragStart = (e: DragEvent, card: ResolvedGlobalCard) => {
        if (e.dataTransfer) {
            e.dataTransfer.setData(
                'application/x-lineage-card',
                JSON.stringify({
                    categoryId: card.categoryId,
                    filePath: card.filePath,
                    section: card.section,
                }),
            );
            e.dataTransfer.setData('text/plain', '');
            e.dataTransfer.effectAllowed = 'move';
        }
    };
</script>

<div class="gc-card-list">
    {#each resolved as card (card.filePath + '|' + card.section)}
        <div class="gc-card-wrapper">
            <div
                class="gc-card-drag"
                draggable={true}
                on:dragstart={(e) => onDragStart(e, card)}
                title={lang.cm_move}
            >
                <button
                    class="gc-card-drag__dot"
                    aria-label={lang.global_categories_move_up}
                    on:click|stopPropagation={() => onMoveCard(card, -1)}
                >
                    <ArrowUp size={14} />
                </button>
                <button
                    class="gc-card-drag__dot"
                    aria-label={lang.global_categories_move_down}
                    on:click|stopPropagation={() => onMoveCard(card, 1)}
                >
                    <ArrowDown size={14} />
                </button>
            </div>
            <div
                class="gc-card-body"
                on:contextmenu={(e) => onCardContextMenu(e, card)}
            >
                <Node
                    node={card.nodeId}
                    active={
                        activeNodeId === card.nodeId
                            ? ActiveStatus.node
                            : ActiveStatus.sibling
                    }
                    editing={
                        editing.activeNodeId === card.nodeId &&
                        editing.isInSidebar
                    }
                    confirmDisableEdit={
                        editing.activeNodeId === card.nodeId &&
                        pending.disableEdit === card.nodeId &&
                        editing.isInSidebar
                    }
                    confirmDelete={pending.deleteNode.has(card.nodeId)}
                    isInSidebar={true}
                    firstColumn={true}
                    section={card.section}
                    hasActiveChildren={false}
                    hasChildren={false}
                    selected={false}
                    pinned={false}
                    style={$styleRules.get(card.nodeId)}
                    outlineMode={false}
                    collapsed={false}
                    hidden={false}
                    alwaysShowCardButtons={true}
                    enableDroppable={false}
                />
                <button
                    class="gc-file-badge"
                    title={lang.global_categories_open_in_file.replace(
                        '{filename}',
                        file.basename,
                    )}
                    on:click|stopPropagation={() =>
                        openCardInLineage(plugin, file, card.section)}
                >
                    {file.basename}
                </button>
            </div>
        </div>
    {/each}
</div>

<style>
    .gc-card-list {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
    }

    .gc-card-wrapper {
        width: 100%;
        display: flex;
        gap: 4px;
        align-items: flex-start;
    }

    .gc-card-drag {
        display: flex;
        flex-direction: column;
        gap: 4px;
        padding-top: 8px;
        cursor: grab;
        flex: 0 0 auto;
    }

    .gc-card-drag__dot {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 22px;
        border-radius: 4px;
        border: 1px solid var(--background-modifier-border);
        background-color: var(--background-secondary);
        color: var(--text-muted);
        cursor: pointer;
        padding: 0;
        box-shadow: none;
    }

    .gc-card-drag__dot:hover {
        background-color: var(--interactive-hover);
        border-color: var(--interactive-accent);
        color: var(--text-normal);
    }

    .gc-card-drag__dot:active {
        opacity: 0.7;
    }

    .gc-card-body {
        flex: 1 1 auto;
        min-width: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
    }

    .gc-file-badge {
        /* file-name marker — only rendered in the global categories view.
           Clicking it opens the card in the original file. */
        margin-top: -6px;
        padding: 2px 10px;
        font-size: var(--font-ui-smaller);
        color: var(--text-muted);
        background-color: var(--background-secondary);
        border: 1px solid var(--background-modifier-border);
        border-radius: 0 0 6px 6px;
        position: relative;
        z-index: 1;
        cursor: pointer;
        max-width: calc(var(--node-width) - 20px);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .gc-file-badge:hover {
        color: var(--text-normal);
        border-color: var(--interactive-accent);
        background-color: var(--background-modifier-hover);
    }

    .gc-file-badge:active {
        opacity: 0.7;
    }
</style>
