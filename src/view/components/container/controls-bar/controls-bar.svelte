<script lang="ts">
	import { HelpCircle, HistoryIcon, RedoIcon, UndoIcon } from 'lucide-svelte';
	import { getStore } from 'src/view/components/container/get-store';
	import { fileHistoryStore } from 'src/features/file-histoy/file-history-store';
	import { FileHistory } from 'src/features/file-histoy/file-history-reducer';

	const store = getStore();
    export let fileHistory: FileHistory | null;
    export let path: string | null;

    const handleNextClick = () => {
        if (path)
            fileHistoryStore.dispatch({
                type: 'UNDO_REDO_SNAPSHOT',
                payload: {
                    path,
                    direction: 'forward',
                },
            });
    };

    const handlePreviousClick = () => {
        if (path)
            fileHistoryStore.dispatch({
                type: 'UNDO_REDO_SNAPSHOT',
                payload: {
                    path,
                    direction: 'back',
                },
            });
    };
</script>

<div class="canvas-controls">
    <div class="canvas-control-group">
        <button
            aria-label="History"
            class="canvas-control-item"
            data-tooltip-position="left"
            disabled={!path || !$fileHistoryStore.documents[path]}
            on:click={() => {
                store.dispatch({ type: 'UI/TOGGLE_HISTORY_SIDEBAR' });
            }}
        >
            <HistoryIcon class="svg-icon" />
        </button>

        <button
            aria-label="Undo"
            class="canvas-control-item"
            data-tooltip-position="left"
            disabled={!fileHistory || !fileHistory.state.canGoBack}
            on:click={handlePreviousClick}
        >
            <UndoIcon class="svg-icon" />
        </button>
        <button
            aria-label="Redo"
            class="canvas-control-item"
            data-tooltip-position="left"
            disabled={!fileHistory || !fileHistory.state.canGoForward}
            on:click={handleNextClick}
        >
            <RedoIcon class="svg-icon" />
        </button>
    </div>
    <div class="canvas-control-group">
        <div
            aria-label="Help"
            class="canvas-control-item"
            data-tooltip-position="left"
        >
            <HelpCircle class="svg-icon" />
        </div>
    </div>
</div>

<style>
    button:disabled {
        cursor: not-allowed;
    }
    .canvas-controls {
        right: var(--size-4-2);
        top: var(--size-4-2);
        gap: var(--size-4-2);
        display: flex;
        flex-direction: column;
        position: absolute;
    }
    .canvas-control-group {
        border-radius: var(--radius-s);
        background-color: var(--background-primary);
        border: 1px solid var(--background-modifier-border);
        box-shadow: var(--input-shadow);
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }
    .canvas-control-item {
        border-radius: 0;
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
    .canvas-control-item:last-child {
        border-bottom: none;
    }
</style>