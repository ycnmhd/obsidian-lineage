<script lang="ts">
	import ControlsBar from './controls-bar/controls-bar.svelte';
	import Hotkeys from './hotkeys/hotkeys.svelte';
	import FileHistory from './file-history/file-histoy.svelte';
	import { LineageView, ViewStore } from '../../view';
	import Lineage from '../../../main';
	import { setContext } from 'svelte';
	import Container from './container.svelte';
	import Breadcrumbs from './breadcrumbs/breadcrumbs.svelte';

	export let store: ViewStore;
    export let plugin: Lineage;
	export let view: LineageView
    const settings = plugin.settings;
    setContext('store', store);
    setContext('plugin', plugin);
	setContext('view',view)
</script>

<div
    class={`lineage__main ${
        $settings.ui.theme === 'dark' ? 'ash-theme-light' : 'ash-theme-dark'
    }`}
>
	<Breadcrumbs/>
    <ControlsBar
		documentHistory={$store.history}
        path={$store.file.path}
    />
    <Container />
    {#if $store.ui.showHistorySidebar && $store.file.path}
        <FileHistory
			documentHistory={$store.history}
            path={$store.file.path}
        />
    {:else if $store.ui.showHelpSidebar}
        <Hotkeys />
    {/if}

</div>

<style>


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
		--background-color-inactive-node: #8ba5b6;
		--color-inactive-node: #edf1f0;
        /*active node*/
        --background-active-node: #ffffff;
        --color-active-node: #0f172a;
        /*active parent*/
        --background-active-parent: #c8dcea;
        --color-active-child: #0f172a;
    }


</style>
