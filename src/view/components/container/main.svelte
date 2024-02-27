<script lang="ts">
	import { fileHistoryStore } from 'src/stores/file-history/file-history-store';
	import ControlsBar from './controls-bar/controls-bar.svelte';
	import Hotkeys from './hotkeys/hotkeys.svelte';
	import FileHistory from './file-history/file-histoy.svelte';
	import { DocumentStore } from '../../view';
	import Lineage from '../../../main';
	import { setContext } from 'svelte';
	import Container from './container.svelte';
	import Breadcrumbs from './breadcrumbs/breadcrumbs.svelte';

	export let store: DocumentStore;
    export let plugin: Lineage;
    const settings = plugin.settings;
    setContext('store', store);
    setContext('plugin', plugin);
</script>

<div
    class={`main ${
        $settings.ui.theme === 'dark' ? 'ash-theme-light' : 'ash-theme-dark'
    }`}
>
	<Breadcrumbs/>
    <ControlsBar
        fileHistory={$fileHistoryStore.documents[$store.file.path]}
        path={$store.file.path}
    />
    <Container />
    {#if $store.state.ui.showHistorySidebar && $store.file.path && $fileHistoryStore.documents[$store.file.path]}
        <FileHistory
            fileHistory={$fileHistoryStore.documents[$store.file.path]}
            path={$store.file.path}
        />
    {:else if $store.state.ui.showHelpSidebar}
        <Hotkeys />
    {/if}

</div>

<style>
    :root {
        --sidebar-right: 50px;
        --node-gap: 4px;
		--z-index-breadcrumbs:10;
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
        --background-color-container: #7b92a1;
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
    }
</style>
