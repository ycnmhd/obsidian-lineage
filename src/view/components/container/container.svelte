<script lang="ts">
	import Column from './column/column.svelte';
	import { DocumentStore } from 'src/view/view';
	import { onDestroy, onMount, setContext } from 'svelte';
	import { keyboardShortcuts } from 'src/view/actions/keyboard-shortcuts/keyboard-shortcuts';
	import FileHistory from './file-history/file-histoy.svelte';
	import { fileHistoryStore } from 'src/stores/file-history/file-history-store';
	import ControlsBar from './controls-bar/controls-bar.svelte';
	import TreeEdit from 'src/main';

	export let store: DocumentStore;
    export let plugin: TreeEdit;
    const settings = plugin.settings;

    // eslint-disable-next-line no-undef
    let ref: HTMLElement;
    onMount(() => {
        store.dispatch({ type: 'SET_CONTAINER', payload: { ref } });
    });
    onDestroy(() => {
        store.dispatch({ type: 'SET_CONTAINER', payload: { ref: null } });
    });
    setContext('store', store);
    setContext('plugin', plugin);
</script>

<div
    class={`main ${
        $settings.ui.theme === 'dark' ? 'ash-theme-light' : 'ash-theme-dark'
    }`}
>
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
        --sidebar-right: 50px;
        --node-gap: 4px;
        /*slate900*/
    }
    .ash-theme-dark {
        --background-color-container: #0f172a;
        /*inactive node*/
        --background-color-inactive-node: #2b3747;
        --color-inactive-node: #617d8c;
        /*active node*/
        --background-active-node: #c6d1dc;
        --color-active-node: #2a3034;
        /*active parent*/
        --background-active-parent: #5f718e;
        --color-active-child: #c6d4dc;
    }
    /*   .theme-light {
        --background-color-container: #4e6471;
        !*inactive node*!
        --background-color-inactive-node: #7e9baa;
        --color-inactive-node: #b7d8ea;
        !*active node*!
        --background-active-node: white;
        --color-active-node: #51575b;
        !*active parent*!
        --background-active-parent: #c1d7d9;
        --color-active-child: #51575b;
    }*/
    .ash-theme-light {
        --background-color-container:#7b92a1;
        /*inactive node*/
        --background-color-inactive-node: #aab7bf;
        --color-inactive-node: #ffffff;
        /*active node*/
        --background-active-node: #ffffff;
        --color-active-node: #0f172a;
        /*active parent*/
        --background-active-parent: #c8dcea;
        --color-active-child: #0f172a;
    }

    .main {
        background-color: var(--background-color-container);
        display: flex;
        height: 100%;
        width: 100%;
        position: relative;
        padding-right: 50px;
    }
    .container {
        flex: 1;
        height: 100%;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: start;
        padding-left: 100px;
        position: relative;
    }
    .columns {
        display: flex;
        align-items: center;
        gap: var(--node-gap);
    }
</style>
