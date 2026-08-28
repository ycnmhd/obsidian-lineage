<script lang="ts">
    import { getView } from './context';
    import { OutlineModeStore, MindmapModeStore } from '../../../stores/settings/derived/view-settings-store';
    import { onDestroy } from 'svelte';
    import Container from './container.svelte';
    import MindmapContainer from './mindmap/mindmap-container.svelte';
    import { limitPreviewHeightStore } from 'src/stores/settings/derived/limit-preview-height-store';
    import { ApplyGapBetweenCardsStore } from 'src/stores/settings/derived/view-settings-store';

    const view = getView();

    let unmounting = false;
    let interval: ReturnType<typeof setTimeout> | null = null;

    const unsubscribeOutline = OutlineModeStore(view).subscribe((state, action, isInitialRun) => {
        if(isInitialRun) return
        unmounting = true;
        if (interval) clearTimeout(interval);
        interval = setTimeout(() => {
            unmounting = false;
        }, 16);
    });

    const unsubscribeMindmap = MindmapModeStore(view).subscribe((state, action, isInitialRun) => {
        if(isInitialRun) return
        unmounting = true;
        if (interval) clearTimeout(interval);
        interval = setTimeout(() => {
            unmounting = false;
        }, 16);
    });

    onDestroy(() => {
        unsubscribeOutline();
        unsubscribeMindmap();
    });

    const outlineMode = OutlineModeStore(view);
    const mindmapMode = MindmapModeStore(view);
    const limitPreviewHeight = limitPreviewHeightStore(view);
    const applyGap = ApplyGapBetweenCardsStore(view);
</script>

{#if !unmounting}
    {#if $mindmapMode}
        <MindmapContainer limitPreviewHeight={$limitPreviewHeight} applyGap={$applyGap} />
    {:else}
        <Container outlineMode={$outlineMode} />
    {/if}
{/if}
