<script lang="ts">
    import { getView } from 'src/view/components/container/context';
    import {
        LeftSidebarActiveTabStore,
        ShowLeftSidebarStore,
    } from 'src/stores/settings/derived/view-settings-store';
    import TabHeader from './components/tab-header/tab-header.svelte';
    import { onDestroy } from 'svelte';
    import PinnedCards from 'src/view/components/container/left-sidebar/components/pinned-cards/pinned-cards-sidebar.svelte';
    import RecentCards from 'src/view/components/container/left-sidebar/components/recent-cards/recent-cards.svelte';
    import SimilarCards from 'src/view/components/container/left-sidebar/components/similar-cards/similar-cards.svelte';
    import { limitPreviewHeightStore } from 'src/stores/settings/derived/limit-preview-height-store';

    const MIN_WIDTH = 250;
    // used to animate using CSS transition width, can go to 0
    let animatedSidebarWidth = 0;
    // this width does not go to 0
    let sidebarWidth = MIN_WIDTH;
    let isResizing = false;
    let startX = 0;

    const view = getView();
    const limitPreviewHeight = limitPreviewHeightStore(view);
    const showSidebarStore = ShowLeftSidebarStore(view);

    const unsub = showSidebarStore.subscribe((show) => {
        if (show) {
            animatedSidebarWidth =
                view.plugin.settings.getValue().view.leftSidebarWidth;
            sidebarWidth = animatedSidebarWidth;
        } else {
            animatedSidebarWidth = 0;
        }
    });
    onDestroy(() => {
        unsub();
    });

    // Handle resize logic
    const onStartResize = (event: MouseEvent) => {
        isResizing = true;
        startX = event.clientX;
        view.contentEl.addEventListener('mousemove', onResize);
        view.contentEl.addEventListener('mouseup', onStopResize);
    };

    const onResize = (event: MouseEvent) => {
        if (!isResizing) return;
        const dx = event.clientX - startX;
        animatedSidebarWidth += dx;
        startX = event.clientX;
        if (animatedSidebarWidth > MIN_WIDTH) {
            sidebarWidth = animatedSidebarWidth;
        }
    };

    const onStopResize = () => {
        isResizing = false;
        view.contentEl.removeEventListener('mousemove', onResize);
        view.contentEl.removeEventListener('mouseup', onStopResize);

        if (animatedSidebarWidth < MIN_WIDTH) {
            animatedSidebarWidth = MIN_WIDTH;
        }
        sidebarWidth = animatedSidebarWidth;
        view.plugin.settings.dispatch({
            type: 'view/left-sidebar/set-width',
            payload: {
                width: animatedSidebarWidth,
            },
        });
    };
    const activeTab = LeftSidebarActiveTabStore(view);
</script>

<div
    class={'sidebar' +
        (isResizing ? '' : ' width-transition') +
        ($limitPreviewHeight ? ' limit-card-height' : '')}
    style="--animated-sidebar-width: {animatedSidebarWidth}px; --sidebar-width: {sidebarWidth}px; }"
>
    <TabHeader />
    <div class="resizer" on:mousedown={onStartResize} />
    {#if $activeTab === 'pinned-cards'}
        <PinnedCards />
    {:else if $activeTab === 'recent-cards'}
        <RecentCards />
    {:else if $activeTab === 'similar-cards'}
        <SimilarCards />
    {/if}

</div>

<style>
    .sidebar {
        --node-width: calc(var(--sidebar-width) - 40px);
        flex: 0 0 auto;
        width: var(--animated-sidebar-width);
        position: relative;
        overflow: hidden;
        background-color: rgba(0, 0, 0, 0.2);
        background-blend-mode: multiply;
        display: flex;
        flex-direction: column;
        padding: 10px 0;
        gap: 10px;
    }
    .width-transition {
        transition: width 0.3s ease;
    }

    .resizer {
        position: absolute;
        top: 0;
        height: 100%;
        bottom: 0;
        background-color: transparent;
        transition: background-color 0.2s;
        cursor: col-resize;
        right: 0px;
        width: 4px;
    }

    .resizer:hover {
        background-color: var(--color-accent);
    }

    .limit-card-height {
        & .lng-prev {
            max-height: 65vh;
        }
        & .editor-container {
            max-height: 65vh;
        }
    }

    /*.sidebar {
        & .active-node {
            outline: 6px solid var(--background-active-parent) !important;
        }
    }*/
</style>
