<script lang="ts">
    import { getStore } from 'src/view/components/container/context';
    import { ArrowLeft, ArrowRight } from 'lucide-svelte';

    const store = getStore();
</script>

<div class="navigation-history-container" >
    <div class="navigation-history">
        <button
            aria-label={'Navigate back'}
            class="navigation-button"
            data-tooltip-position="bottom"
            disabled={!$store.navigationHistory.state.canGoBack}
            on:click={() => {
                store.dispatch({ type: 'NAVIGATION/NAVIGATE_BACK' });
            }}
        >
            <ArrowLeft class="svg-icon" size="12" />
        </button>
        <button
            aria-label={'Navigate forward'}
            class="navigation-button"
            data-tooltip-position="bottom"
            disabled={!$store.navigationHistory.state.canGoForward}
            on:click={() => {
                store.dispatch({ type: 'NAVIGATION/NAVIGATE_FORWARD' });
            }}
        >
            <ArrowRight class="svg-icon" size="12" />
        </button>
    </div>
</div>

<style>
    .navigation-history-container {
        z-index: var(--z-index-breadcrumbs);
        left: var(--size-4-2);
        top: var(--size-4-2);
        display: flex;
        position: absolute;
    }
    .navigation-history {
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: var(--radius-s);
        background-color: var(--interactive-normal);
        border: 1px solid var(--background-modifier-border);
        box-shadow: var(--input-shadow);
        overflow: hidden;
    }
    .navigation-button {
        box-shadow: none;
        display: flex;
        line-height: 1;
        font-size: inherit;
        align-items: center;
        justify-content: center;
        padding: var(--size-4-2);
        width: 30px;
        height: 30px;
        border-bottom: 1px solid var(--background-modifier-border);
        color: var(--text-muted);
        background-color: var(--interactive-normal);
        --icon-size: var(--icon-s);
        --icon-stroke: var(--icon-s-stroke-width);
        cursor: pointer;
    }

    .navigation-button:hover {
        background-color: var(--interactive-hover);
    }
    .navigation-button:last-child {
        border-bottom: none;
    }

    button:disabled {
        cursor: not-allowed;
        color: var(--color-base-40);
    }
</style>
