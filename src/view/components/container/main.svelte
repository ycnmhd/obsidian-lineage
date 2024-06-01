<script lang="ts">
    import ControlsBar from './controls-bar/controls-container.svelte';
    import Container from './container.svelte';
    import Breadcrumbs from './breadcrumbs/breadcrumbs.svelte';
    import Toolbar from './toolbar/toolbar.svelte';
    import Settings from './controls-bar/modals/settings/settings.svelte';
    import FileHistory from 'src/view/components/container/controls-bar/modals/snapshots-list/file-histoy.svelte';
    import Hotkeys from 'src/view/components/container/controls-bar/modals/hotkeys/hotkeys.svelte';
    import { LineageView } from '../../view';
    import Lineage from '../../../main';
    import { setContext } from 'svelte';
    import { uiControlsStore } from 'src/stores/view/derived/ui-controls-store';
    import { scrollingModeStore } from 'src/stores/settings/derived/scrolling-store';
    import ScrollingAxis from 'src/view/components/container/scrolling-axis/scrolling-axis.svelte';
    import { keyboardShortcuts } from 'src/view/actions/keyboard-shortcuts/keyboard-shortcuts';
    import { mouseWheelZoom } from 'src/view/actions/mouse-wheel-zoom';

    export let plugin: Lineage;
    export let view: LineageView;
    setContext('plugin', plugin);
    setContext('view', view);
    const controls = uiControlsStore(view);
    const scrollingMode = scrollingModeStore(view);
</script>

<div
    class={`lineage-main`}
    use:keyboardShortcuts={{ view }}
    use:mouseWheelZoom={view}
>
    <Container />
    <Toolbar />
    <Breadcrumbs />
    <ControlsBar />
    {#if $controls.showHistorySidebar}
        <FileHistory />
    {:else if $controls.showHelpSidebar}
        <Hotkeys />
    {:else if $controls.showSettingsSidebar}
        <Settings />
    {/if}
    {#if $scrollingMode === 'fixed-position'}
        <ScrollingAxis />
    {/if}
</div>

<style>
    .lineage-main {

        --z-index-breadcrumbs: 10;
        background-color: var(--background-container);
        display: flex;
        height: 100%;
        width: 100%;
        position: relative;
    }

    .lineage-main:not(:focus-within) {
        & .node-border--active {
            border-left-color: var(--lineage-accent-faint);
        }
        & .node-border--editing {
            border-left-color: var(--color-base-40);
        }
        & .node-border--discard {
            border-left-color: #e8314660;
        }
    }
</style>
