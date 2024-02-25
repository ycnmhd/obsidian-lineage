<script lang="ts">
	import Column from './column/column.svelte';
	import { DocumentStore } from 'src/view/view';
	import { onDestroy, onMount, setContext } from 'svelte';
	import { keyboardShortcuts } from 'src/view/actions/keyboard-shortcuts/keyboard-shortcuts';
	import FileHistory from './file-history/file-histoy.svelte';
	import { fileHistoryStore } from 'src/stores/file-history/file-history-store';
	import ControlsBar from './controls-bar/controls-bar.svelte';

	export let store: DocumentStore;

    // eslint-disable-next-line no-undef
    let ref: HTMLElement;
    onMount(() => {
        store.dispatch({ type: 'SET_CONTAINER', payload: { ref } });
    });
    onDestroy(() => {
        store.dispatch({ type: 'SET_CONTAINER', payload: { ref: null } });
    });
    setContext('store', store);
</script>

<div class="main">
        <ControlsBar
            fileHistory={$fileHistoryStore.documents[$store.file.path]}
            path={$store.file.path}
        />
    <div
        bind:this={ref}
        class="container"
        id="columns-container"
        tabindex="0"
        use:keyboardShortcuts={store}
    >
        <div class="columns">
            {#each $store.columns as column (column.id)}
                <Column {column} />
            {/each}
        </div>
    </div>
    {#if $store.state.ui.showHistorySidebar && $store.file.path && $fileHistoryStore.documents[$store.file.path]}
        <FileHistory
            fileHistory={$fileHistoryStore.documents[$store.file.path]}
            path={$store.file.path}
        />
    {/if}
</div>

<style>
    :root {
        --node-bg: #318bbf;
        --node-bg-active: #fff;
        --parent-bg: #68a6ca;
        --container-bg: #1d7db4;
        --sidebar-right: 50px;
    }
    .main {
        background-color: var(--container-bg);
        display: flex;
        height: 100%;
        width: 100%;
        position: relative;
        padding-right: 50px;
    }
    .container {
        flex: 1;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: start;
        padding-left: 100px;
        position: relative;
    }
    .columns {
        display: flex;
        align-items: center;
    }
</style>
