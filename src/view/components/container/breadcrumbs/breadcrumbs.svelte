<script lang="ts">
    import { ChevronRight } from 'lucide-svelte';
    import { getView } from 'src/view/components/container/context';

    const view = getView();
    const viewStore = view.viewStore;
    const documentStore = view.documentStore
</script>

<div class="breadcrumbs-container">
    <div class="breadcrumbs">
        {#each $viewStore.document.activeBranch.sortedParentNodes as parent, i}
            {#if i > 0}
                <ChevronRight class="svg-icon chevron" size="12"  />
            {/if}
            <button
                aria-label={$documentStore.document.content[parent]?.content || 'Empty parent'}
                class="breadcrumbs-item"
                data-tooltip-position="up"
                on:click={() => {
                    viewStore.dispatch({
                        type: 'DOCUMENT/SET_ACTIVE_NODE',
                        payload: { id: parent },
                    });
                }}
            >
                <span class="breadcrumbs-item-text">
                    {$documentStore.document.content[parent]?.content || '(empty)'}
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
    .chevron {
        color: var(--text-muted);
    }
    .breadcrumbs-item {
        box-shadow: none;
        height: 30px;
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
