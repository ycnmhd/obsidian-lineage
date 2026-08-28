<script lang="ts">
    import { getView } from 'src/view/components/container/context';
    import { markdownPreviewAction } from 'src/view/actions/markdown-preview/markdown-preview-action';
    import {
        handleLinks
    } from 'src/view/components/container/column/components/group/components/card/components/content/event-handlers/handle-links/handle-links';
    import { ActiveStatus } from 'src/view/components/container/column/components/group/components/active-status.enum';
    import {
        getCursorPosition
    } from 'src/view/components/container/column/components/group/components/card/components/content/event-handlers/get-cursor-position';
    import { get } from 'svelte/store';
    import { contentStore } from 'src/stores/document/derived/content-store';
    import { isGrabbing } from './event-handlers/helpers/is-grabbing';
    import { MaintainEditMode } from '../../../../../../../../../../stores/settings/derived/view-settings-store';
    import {
        setActiveSidebarNode
    } from '../../../../../../../../../../stores/view/subscriptions/actions/set-active-sidebar-node';
    import { setActiveMainSplitNode } from './store-actions/set-active-main-split-node';
    import { enableEditModeInSidebar } from './store-actions/enable-edit-mode-in-sidebar';
    import { enableEditModeInMainSplit } from './store-actions/enable-edit-mode-in-main-split';

    export let nodeId: string;
    export let isInSidebar: boolean;
    export let active: ActiveStatus | null;

    const view = getView();

    const setActiveNode = (e: MouseEvent) => {
        if (isInSidebar) {
            setActiveSidebarNode(view, nodeId);
        } else {
            setActiveMainSplitNode(view, nodeId, e);
        }
    };

    const enableEditMode = () => {
        if (isInSidebar) {
            enableEditModeInSidebar(view, nodeId);
        } else {
            enableEditModeInMainSplit(view, nodeId);
        }
    };

    const enableEditModeAtCursor = (e: MouseEvent) => {
        const content = get(contentStore(view, nodeId));
        const cursor = getCursorPosition(content, e);
        setActiveNode(e);
        if (cursor) {
            view.inlineEditor.setNodeCursor(nodeId, cursor);
        }
        enableEditMode();
    };

    const anotherNodeIsBeingEdited = () => {
        const isNotActiveNode = active !== ActiveStatus.node;
        const editingState = view.viewStore.getValue().document.editing;
        return (
            isNotActiveNode &&
            editingState.activeNodeId &&
            !editingState.isInSidebar
        );
    };

    const handleClick = (e: MouseEvent) => {
        if (isGrabbing(view)) return;
        const maintainEditMode = get(MaintainEditMode(view));
        const enableEditOnSingleClick =
            maintainEditMode && !isInSidebar && anotherNodeIsBeingEdited();

        if (enableEditOnSingleClick) {
            enableEditModeAtCursor(e);
        } else {
            handleLinks(view, e);
            setActiveNode(e);
        }
    };

    const handleDoubleClick = (e: MouseEvent) => {
        if (isGrabbing(view)) return;
        enableEditModeAtCursor(e);
    };
</script>

<div
    class={'lng-prev markdown-preview-view markdown-preview-section markdown-rendered'}
    on:click={handleClick}
    on:dblclick={handleDoubleClick}
    use:markdownPreviewAction={{ nodeId }}
></div>

<style>
    .lng-prev {
        width: 100%;
        min-height: var(--min-node-height);

        font-size: var(--font-text-size);
        padding: 6px 6px 10px 12px;
        color-scheme: light;
    }
</style>
