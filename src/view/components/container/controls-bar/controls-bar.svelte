<script lang="ts">
    import {
        File,
        HistoryIcon,
        Keyboard,
        Maximize,
        RedoIcon,
        RotateCcw,
        UndoIcon,
        ZoomIn,
        ZoomOut
    } from 'lucide-svelte';
    import { getPlugin, getView } from 'src/view/components/container/context';
    import { LineageView } from 'src/view/view';
    import { lang } from 'src/lang/lang';
    import { DocumentHistory } from 'src/stores/document/document-state-type';
    import { maxZoomLevel, minZoomLevel } from 'src/stores/view/reducers/ui/change-zoom-level';
    import { setFileViewType } from 'src/obsidian/events/workspace/helpers/set-file-view-type';
    import { Notice } from 'obsidian';

    const view = getView();
    const viewStore = view.viewStore;
    const documentStore = view.documentStore;
    export let documentHistory: DocumentHistory;
    export let path: string | null;

    const handleNextClick = () => {
        if (path){
            if (viewStore.getValue().document.editing.activeNodeId)
                new Notice('cannot apply snapshot while editing');
            else
            documentStore.dispatch({
                type: 'HISTORY/APPLY_NEXT_SNAPSHOT',
            });
        }
    };

    const handlePreviousClick = () => {
        if (path) {
            if (viewStore.getValue().document.editing.activeNodeId)
                new Notice('cannot apply snapshot while editing');
            else
                documentStore.dispatch({
                    type: 'HISTORY/APPLY_PREVIOUS_SNAPSHOT',
                });
        }
    };
    const plugin = getPlugin();

    const toggleHelp = () => {
        viewStore.dispatch({ type: 'UI/TOGGLE_HELP_SIDEBAR' });
    };

    const openAsMarkdown = () => {
        const file =
            plugin.app.workspace.getActiveViewOfType(LineageView)?.file;
        if (file) setFileViewType(plugin, file, view.leaf, 'markdown');
    };
    const zoomIn = () => {
        viewStore.dispatch({
            type: 'UI/CHANGE_ZOOM_LEVEL',
            payload: { direction: 'in' },
        });
    };
    const zoomOut = () => {
        viewStore.dispatch({
            type: 'UI/CHANGE_ZOOM_LEVEL',
            payload: { direction: 'out' },
        });
    };

    const restoreZoom = () => {
        viewStore.dispatch({
            type: 'UI/CHANGE_ZOOM_LEVEL',
            payload: { value: 1 },
        });
    };

    const fitToScale = () => {
        restoreZoom();
        const columns = Array.from(
            view.containerEl.querySelectorAll('.column'),
        );
        if (columns.length) {
            const scrolls = columns.map((c) => c.scrollHeight).sort();
            const biggest = scrolls[scrolls.length - 1];
            // eslint-disable-next-line no-undef
            const scale = window.innerHeight / biggest;
            viewStore.dispatch({
                type: 'UI/CHANGE_ZOOM_LEVEL',
                payload: { value: scale },
            });
        }
    };
</script>

<div class="controls-container">
    <div class="lineage-view-control-group">
        <button
            aria-label={lang.open_in_editor}
            class="control-item"
            data-tooltip-position="left"
            on:click={openAsMarkdown}
        >
            <File class="svg-icon" />
        </button>
        <button
            aria-label="Keyboard shortcuts"
            class="control-item"
            data-tooltip-position="left"
            on:click={toggleHelp}
        >
            <Keyboard class="svg-icon" />
        </button>
    </div>
    <div class="lineage-view-control-group">
        <button
            aria-label="History"
            class="control-item"
            data-tooltip-position="left"
            disabled={documentHistory.items.length === 0}
            on:click={() => {
                viewStore.dispatch({ type: 'UI/TOGGLE_HISTORY_SIDEBAR' });
            }}
        >
            <HistoryIcon class="svg-icon" />
        </button>

        <button
            aria-label="Undo"
            class="control-item"
            data-tooltip-position="left"
            disabled={!documentHistory || !documentHistory.state.canGoBack}
            on:click={handlePreviousClick}
        >
            <UndoIcon class="svg-icon" />
        </button>
        <button
            aria-label="Redo"
            class="control-item"
            data-tooltip-position="left"
            disabled={!documentHistory || !documentHistory.state.canGoForward}
            on:click={handleNextClick}
        >
            <RedoIcon class="svg-icon" />
        </button>
    </div>
    <div class="lineage-view-control-group">
        <button
            aria-label="zoom in"
            class="control-item"
            data-tooltip-position="left"
            disabled={$viewStore.ui.zoomLevel === maxZoomLevel}
            on:click={zoomIn}
        >
            <ZoomIn class="svg-icon" />
        </button>
        <button
            aria-label="Restore zoom level"
            class="control-item"
            data-tooltip-position="left"
            on:click={restoreZoom}
        >
            <RotateCcw class="svg-icon" />
        </button>
        <button
            aria-label="Zoom to fit"
            class="control-item"
            data-tooltip-position="left"
            on:click={fitToScale}
        >
            <Maximize class="svg-icon" />
        </button>
        <button
            aria-label="Zoom out"
            class="control-item"
            data-tooltip-position="left"
            disabled={$viewStore.ui.zoomLevel === minZoomLevel}
            on:click={zoomOut}
        >
            <ZoomOut class="svg-icon" />
        </button>
    </div>
</div>

<style>
    button:disabled {
        cursor: not-allowed;
        color: var(--color-base-40);
    }
    .controls-container {
        right: var(--size-4-2);
        top: var(--size-4-2);
        gap: var(--size-4-2);
        display: flex;
        flex-direction: column;
        position: absolute;
        z-index: 2;
    }
    .lineage-view-control-group {
        border-radius: var(--radius-s);
        background-color: var(--background-primary);
        border: 1px solid var(--background-modifier-border);
        box-shadow: var(--input-shadow);
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }
    .control-item {
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
    .control-item:last-child {
        border-bottom: none;
    }
</style>
