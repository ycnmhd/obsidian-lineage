<script lang="ts">
	import { getStore } from 'src/view/components/container/context';
	import { ChevronRight } from 'lucide-svelte';

	const store = getStore();
</script>

<div class="breadcrumbs-container">
    <div class="breadcrumbs">
        {#each $store.document.state.activeBranch.sortedParentNodes as parent, i}
            {#if i > 0}
                <ChevronRight class="svg-icon" size="12" />
            {/if}
            <button
                aria-label={$store.document.content[parent]?.content || 'Empty parent'}
                class="breadcrumbs-item"
                data-tooltip-position="left"
                on:click={() => {
                    store.dispatch({
                        type: 'SET_ACTIVE_NODE',
                        payload: { id: parent },
                    });
                }}
            >
                <span class="breadcrumbs-item-text">
                    {$store.document.content[parent]?.content || '(empty)'}
                </span>
            </button>
        {/each}
    </div>
</div>

<style>
    button:disabled {
        cursor: not-allowed;
    }
    .breadcrumbs-container {
        z-index: var(--z-index-breadcrumbs);
        left: var(--size-4-2);
        bottom: var(--size-4-2);
        display: flex;
        position: absolute;
    }
    .breadcrumbs {
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: var(--radius-s);
        background-color: var(--interactive-normal);
        border: 1px solid var(--background-modifier-border);
        box-shadow: var(--input-shadow);
        overflow: hidden;
    }
    .breadcrumbs-item {
        box-shadow: none;
        height: auto;
        display: flex;
        line-height: 1;
        font-size: inherit;
        align-items: center;
        justify-content: center;
        padding: var(--size-4-2);
        border-bottom: 1px solid var(--background-modifier-border);
        color: var(--text-muted);
        background-color: var(--interactive-normal);
        --icon-size: var(--icon-s);
        --icon-stroke: var(--icon-s-stroke-width);
        cursor: pointer;
    }

    .breadcrumbs-item:hover {
        background-color: var(--interactive-hover);
    }
    .breadcrumbs-item:last-child {
        border-bottom: none;
    }
    .breadcrumbs-item-text {
        max-width: 200px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
</style>
