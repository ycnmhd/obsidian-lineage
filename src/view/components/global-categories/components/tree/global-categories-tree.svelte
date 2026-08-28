<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import Lineage from 'src/main';
    import TreeItem from './tree-item.svelte';
    import { GlobalCategoryNode } from 'src/stores/settings/types/global-categories-types';
    import { lang } from 'src/lang/lang';
    import { showRootContextMenu } from '../../helpers/tree-actions';

    export let plugin: Lineage;
    export let tree: GlobalCategoryNode[];
    export let selectedNodeId: string | null;

    const dispatch = createEventDispatcher<{
        select: { id: string };
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

    let collapsed = new Set<string>();
    let draggedNodeId: string | null = null;
    let dropTarget: {
        nodeId: string;
        position: 'before' | 'after' | 'inside';
    } | null = null;
    let rootEl: HTMLElement;

    const onToggle = (e: { detail: { id: string } }) => {
        collapsed = new Set(collapsed);
        if (collapsed.has(e.detail.id)) collapsed.delete(e.detail.id);
        else collapsed.add(e.detail.id);
    };

    const onDragStart = (e: { detail: { id: string } }) => {
        draggedNodeId = e.detail.id;
    };

    const onDragEnd = () => {
        draggedNodeId = null;
        dropTarget = null;
    };

    const onDragOver = (e: {
        detail: { nodeId: string; position: 'before' | 'after' | 'inside' };
    }) => {
        if (!draggedNodeId) return;
        dropTarget = {
            nodeId: e.detail.nodeId,
            position: e.detail.position,
        };
    };

    const onMove = (e: {
        detail: {
            id: string;
            targetId: string;
            position: 'before' | 'after' | 'inside';
        };
    }) => {
        onDragEnd();
        dispatch('move', e.detail);
    };

    // Drop onto the empty root area → move to root (append)
    const onRootDragOver = (e: DragEvent) => {
        if (!draggedNodeId) return;
        e.preventDefault();
        dropTarget = { nodeId: '__root__', position: 'inside' };
    };

    const onRootDrop = (e: DragEvent) => {
        e.preventDefault();
        if (!draggedNodeId) return;
        dispatch('move', {
            id: draggedNodeId,
            targetId: '__root__',
            position: 'inside',
        });
        onDragEnd();
    };

    const onRootContextMenu = (e: MouseEvent) => {
        e.preventDefault();
        showRootContextMenu(plugin, e);
    };
</script>

<div
    class="gc-tree-root"
    bind:this={rootEl}
    on:dragover={onRootDragOver}
    on:drop={onRootDrop}
    on:dragend={onDragEnd}
    on:contextmenu={onRootContextMenu}
>
    {#if tree.length === 0}
        <div class="gc-tree-empty">
            {lang.global_categories_empty_tree}
        </div>
    {:else}
        {#each tree as node (node.id)}
            <TreeItem
                {plugin}
                {node}
                depth={0}
                {selectedNodeId}
                collapsedIds={collapsed}
                {draggedNodeId}
                {dropTarget}
                on:select={(e) => dispatch('select', e.detail)}
                on:toggle={onToggle}
                on:dragstart={onDragStart}
                on:dragend={onDragEnd}
                on:dragover={onDragOver}
                on:move={onMove}
                on:card-drop={(e) => dispatch('card-drop', e.detail)}
                on:delete={(e) => dispatch('delete', e.detail)}
            />
        {/each}
    {/if}
</div>

<style>
    .gc-tree-root {
        flex: 1 1 auto;
        overflow-y: auto;
        padding: 4px;
        min-height: 100%;
    }

    .gc-tree-empty {
        padding: 16px 10px;
        color: var(--text-muted);
        font-size: var(--font-ui-small);
        white-space: pre-line;
    }
</style>
