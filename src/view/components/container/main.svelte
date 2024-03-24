<script lang="ts">
    import ControlsBar from './controls-bar/controls-bar.svelte';
    import Hotkeys from './hotkeys/hotkeys.svelte';
    import FileHistory from './file-history/file-histoy.svelte';
    import { LineageView } from '../../view';
    import Lineage from '../../../main';
    import { setContext } from 'svelte';
    import Container from './container.svelte';
    import Breadcrumbs from './breadcrumbs/breadcrumbs.svelte';
    import NavigationHistory from './navigation-history/navigation-history.svelte';
    import SearchBar from './search-bar/search-bar.svelte';

    export let plugin: Lineage;
    export let view: LineageView;
    const documentStore = view.documentStore
    const viewStore = view.viewStore;
    const settings = plugin.settings;
    setContext('plugin', plugin);
    setContext('view', view);
</script>

<div
    class={` lineage-main ${
        $settings.ui.theme === 'dark' ? 'lineage-theme-light' : 'lineage-theme-dark'
    } ${$viewStore.search.searching ? "is-loading":""}`}
>
    <Breadcrumbs />
    <NavigationHistory />
    <ControlsBar documentHistory={$documentStore.history} path={$documentStore.file.path} />
    <Container />
    {#if $viewStore.ui.showHistorySidebar && $documentStore.file.path}
        <FileHistory documentHistory={$documentStore.history} path={$documentStore.file.path} />
    {:else if $viewStore.ui.showHelpSidebar}
        <Hotkeys />
    {/if}
    <SearchBar />
</div>

<style>
    .lineage-main {
        --sidebar-right: 50px;
        --z-index-breadcrumbs: 10;
        background-color: var(--background-color-container);
        display: flex;
        height: 100%;
        width: 100%;
        position: relative;
    }
</style>
