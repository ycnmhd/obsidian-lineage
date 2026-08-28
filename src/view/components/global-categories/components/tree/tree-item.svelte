<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import Lineage from 'src/main';
    import { ChevronRight, ChevronDown, Folder, Tag } from 'lucide-svelte';
    import { GlobalCategoryNode } from 'src/stores/settings/types/global-categories-types';
    import { showTreeContextMenu } from '../../helpers/tree-actions';
    import TreeItem from './tree-item.svelte';

    export let plugin: Lineage;
    export let node: GlobalCategoryNode;
    export let depth: number;
    export let selectedNodeId: string | null;
    export let collapsedIds: Set<string>;
    export let draggedNodeId: string | null;
    export let dropTarget: {
        nodeId: string;
        position: 'before' | 'after' | 'inside';
    } | null;

    const dispatch = createEventDispatcher<{
        select: { id: string };
        toggle: { id: string };
        dragstart: { id: string };
        dragend: { id: string };
        dragover: {
            nodeId: string;
            position: 'before' | 'after' | 'inside';
        };
        move: {
            id: string;
            targetId: string;
            position: 'before' | 'after' | 'inside';
        };
        'card-drop': {
            card: { categoryId: string; filePath: string; section: string };
            targetCategoryId: string;
        };
        delete: { node: GlobalCategoryNode };
    }>();

    // NOTE: must be reactive — plain consts are only evaluated once when the
    // component is instantiated, so they'd never update when props change
    $: isFolder = node.type === 'folder';
    $: isExpanded = !collapsedIds.has(node.id);
    $: hasChildren = isFolder && node.children.length > 0;
    $: isSelected = selectedNodeId === node.id;
    $: isDragged = draggedNodeId === node.id;
    $: isDropTarget = dropTarget?.nodeId === node.id;

    let rowEl: HTMLElement;

    const onContextMenu = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        showTreeContextMenu(plugin, e, node, {
            onDelete: (n) => dispatch('delete', { node: n }),
        });
    };

    const onSelect = () => {
        dispatch('select', { id: node.id });
    };

    const onToggle = () => {
        if (isFolder) dispatch('toggle', { id: node.id });
    };

    const onDragStart = (e: DragEvent) => {
        dispatch('dragstart', { id: node.id });
        if (e.dataTransfer) {
            e.dataTransfer.setData('text/plain', node.id);
            e.dataTransfer.effectAllowed = 'move';
        }
    };

    const isCardDrag = (e: DragEvent) =>
        Array.from(e.dataTransfer?.types ?? []).includes(
            'application/x-lineage-card',
        );

    const onDragOver = (e: DragEvent) => {
        const cardDrag = isCardDrag(e);
        if (!cardDrag && (!draggedNodeId || draggedNodeId === node.id)) return;
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer!.dropEffect = 'move';
        if (cardDrag) {
            // folders cannot hold cards; only categories accept card drops
            if (node.type !== 'category') return;
            dispatch('dragover', { nodeId: node.id, position: 'inside' });
            return;
        }
        const rect = rowEl.getBoundingClientRect();
        const y = e.clientY - rect.top;
        const position: 'before' | 'after' | 'inside' =
            isFolder && y > rect.height * 0.3 && y < rect.height * 0.7
                ? 'inside'
                : y < rect.height * 0.5
                  ? 'before'
                  : 'after';
        dispatch('dragover', { nodeId: node.id, position });
    };

    const onDrop = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const cardData = e.dataTransfer?.getData(
            'application/x-lineage-card',
        );
        if (cardData) {
            if (node.type !== 'category') return;
            try {
                const card = JSON.parse(cardData) as {
                    categoryId: string;
                    filePath: string;
                    section: string;
                };
                dispatch('card-drop', {
                    card,
                    targetCategoryId: node.id,
                });
            } catch {
                // ignore malformed payloads
            }
            return;
        }
        const id = draggedNodeId ?? e.dataTransfer?.getData('text/plain') ?? '';
        if (!id || id === node.id) return;
        const position =
            dropTarget?.nodeId === node.id
                ? dropTarget.position
                : isFolder
                  ? 'inside'
                  : 'before';
        dispatch('move', { id, targetId: node.id, position });
    };
</script>

<div
    class="gc-tree-item"
    class:gc-tree-item--selected={isSelected}
    class:gc-tree-item--dragged={isDragged}
    class:gc-tree-item--drop-before={isDropTarget &&
        dropTarget?.position === 'before'}
    class:gc-tree-item--drop-after={isDropTarget &&
        dropTarget?.position === 'after'}
    class:gc-tree-item--drop-inside={isDropTarget &&
        dropTarget?.position === 'inside'}
    style="padding-left: {depth * 14}px"
    bind:this={rowEl}
    draggable={true}
    on:dragstart={onDragStart}
    on:dragend={() => dispatch('dragend', { id: node.id })}
    on:dragover={onDragOver}
    on:drop={onDrop}
    on:click={onSelect}
    on:contextmenu={onContextMenu}
>
    <span
        class="gc-tree-item__chevron"
        class:gc-tree-item__chevron--hidden={!isFolder}
        on:click|stopPropagation={onToggle}
    >
        {#if isFolder}
            {#if isExpanded && hasChildren}
                <ChevronDown size={14} />
            {:else}
                <ChevronRight size={14} />
            {/if}
        {/if}
    </span>
    <span class="gc-tree-item__icon">
        {#if isFolder}
            <Folder size={14} />
        {:else}
            <Tag size={14} />
        {/if}
    </span>
    <span class="gc-tree-item__name">{node.name}</span>
</div>

{#if isFolder && isExpanded && hasChildren}
    {#each node.children as child (child.id)}
        <TreeItem
            {plugin}
            node={child}
            depth={depth + 1}
            {selectedNodeId}
            {collapsedIds}
            {draggedNodeId}
            {dropTarget}
            on:select={(e) => dispatch('select', e.detail)}
            on:toggle={(e) => dispatch('toggle', e.detail)}
            on:dragstart={(e) => dispatch('dragstart', e.detail)}
            on:dragend={(e) => dispatch('dragend', e.detail)}
            on:dragover={(e) => dispatch('dragover', e.detail)}
            on:move={(e) => dispatch('move', e.detail)}
            on:card-drop={(e) => dispatch('card-drop', e.detail)}
            on:delete={(e) => dispatch('delete', e.detail)}
        />
    {/each}
{/if}

<style>
    .gc-tree-item {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 3px 6px;
        margin: 1px 0;
        border-radius: 4px;
        cursor: pointer;
        position: relative;
        user-select: none;
        font-size: var(--font-ui-small);
        color: var(--text-normal);
    }

    .gc-tree-item:hover {
        background-color: var(--background-modifier-hover);
    }

    .gc-tree-item--selected {
        background-color: var(--interactive-accent);
        color: var(--text-on-accent);
    }

    .gc-tree-item--selected:hover {
        background-color: var(--interactive-accent);
    }

    .gc-tree-item--dragged {
        opacity: 0.4;
    }

    .gc-tree-item--drop-inside {
        box-shadow: inset 0 0 0 2px var(--interactive-accent);
    }

    .gc-tree-item--drop-before::before {
        content: '';
        position: absolute;
        top: -1px;
        left: 4px;
        right: 4px;
        height: 2px;
        background-color: var(--interactive-accent);
        border-radius: 1px;
    }

    .gc-tree-item--drop-after::after {
        content: '';
        position: absolute;
        bottom: -1px;
        left: 4px;
        right: 4px;
        height: 2px;
        background-color: var(--interactive-accent);
        border-radius: 1px;
    }

    .gc-tree-item__chevron {
        display: inline-flex;
        align-items: center;
        width: 16px;
        flex: 0 0 16px;
    }

    .gc-tree-item__chevron--hidden {
        visibility: hidden;
    }

    .gc-tree-item__icon {
        display: inline-flex;
        align-items: center;
        flex: 0 0 auto;
    }

    .gc-tree-item__name {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
</style>
