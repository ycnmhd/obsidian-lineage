<script lang="ts">
	import { File, HelpCircle, HistoryIcon, Moon, RedoIcon, Sun, UndoIcon } from 'lucide-svelte';
	import { getPlugin, getStore } from 'src/view/components/container/context';
	import { toggleFileViewType } from 'src/obsidian/events/workspace/helpers/toggle-file-view-type';
	import { LineageView } from 'src/view/view';
	import { lang } from 'src/lang/lang';
	import { DocumentHistory } from 'src/stores/view/view-state-type';

	const store = getStore();
    export let documentHistory: DocumentHistory;
    export let path: string | null;

    const handleNextClick = () => {
        if (path)
            store.dispatch({
                type: 'HISTORY/APPLY_NEXT_SNAPSHOT',
            });
    };

    const handlePreviousClick = () => {
        if (path)
            store.dispatch({
                type: 'HISTORY/APPLY_PREVIOUS_SNAPSHOT',
            });
    };
    const plugin = getPlugin();
    const settings = plugin.settings;
    const toggleTheme = () => {
        settings.dispatch({ type: 'TOGGLE_THEME' });
    };
    const toggleHelp = () => {
        store.dispatch({ type: 'UI/TOGGLE_HELP_SIDEBAR' });
    };

    const openAsMarkdown = () => {
        const file =
            plugin.app.workspace.getActiveViewOfType(LineageView)?.file;
        if (file) toggleFileViewType(plugin, file, undefined);
    };
</script>

<div class="canvas-controls">
    <div class="canvas-control-group">
        <button
            aria-label={lang.open_in_editor}
            class="canvas-control-item"
            data-tooltip-position="left"
            on:click={openAsMarkdown}
        >
            <File class="svg-icon" />
        </button>
    </div>
    <div class="canvas-control-group">
        <button
            aria-label="History"
            class="canvas-control-item"
            data-tooltip-position="left"
            disabled={documentHistory.snapshots.length === 0}
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
            disabled={!documentHistory || !documentHistory.state.canGoBack}
            on:click={handlePreviousClick}
        >
            <UndoIcon class="svg-icon" />
        </button>
        <button
            aria-label="Redo"
            class="canvas-control-item"
            data-tooltip-position="left"
            disabled={!documentHistory || !documentHistory.state.canGoForward}
            on:click={handleNextClick}
        >
            <RedoIcon class="svg-icon" />
        </button>
    </div>
    <div class="canvas-control-group">
        <button
            aria-label="Theme"
            class="canvas-control-item"
            data-tooltip-position="left"
            on:click={toggleTheme}
        >
            {#if $settings.ui.theme === 'dark'}
                <Sun class="svg-icon" />
            {:else}
                <Moon class="svg-icon" />
            {/if}
        </button>
        <button
            aria-label="Help"
            class="canvas-control-item"
            data-tooltip-position="left"
            on:click={toggleHelp}
        >
            <HelpCircle class="svg-icon" />
        </button>
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
