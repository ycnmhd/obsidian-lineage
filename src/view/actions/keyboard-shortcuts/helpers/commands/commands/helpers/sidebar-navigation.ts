import { LineageView } from 'src/view/view';
import { get } from 'svelte/store';
import { FilteredPinnedNodesStore } from 'src/stores/document/derived/filtered-pinned-nodes-store';

/**
 * Checks if keyboard navigation should target the sidebar pinned cards.
 * Returns true when the left sidebar is showing and the pinned-cards tab is active.
 */
export const shouldNavigateInSidebar = (view: LineageView): boolean => {
    const viewState = view.viewStore.getValue();
    const settings = view.plugin.settings.getValue();

    const sidebarVisible = viewState.ui.controls.showLeftSidebar;
    const activeTab = settings.view.leftSidebarActiveTab;

    if (!sidebarVisible || activeTab !== 'pinned-cards') {
        return false;
    }

    // Check if there are pinned nodes to navigate
    const filteredPinnedNodes = get(FilteredPinnedNodesStore(view));
    return filteredPinnedNodes.nodes.length > 0;
};

/**
 * Navigates within the sidebar pinned cards list.
 * Only 'up' and 'down' directions are supported.
 */
export const navigatePinnedCards = (
    view: LineageView,
    direction: 'up' | 'down',
) => {
    const filteredPinnedNodes = get(FilteredPinnedNodesStore(view));
    const nodes = filteredPinnedNodes.nodes;

    if (nodes.length === 0) return;

    const viewState = view.viewStore.getValue();
    const activeNodeId = viewState.pinnedNodes.activeNode;

    // If no active node, activate the first or last depending on direction
    if (!activeNodeId) {
        const targetIndex = direction === 'up' ? nodes.length - 1 : 0;
        view.viewStore.dispatch({
            type: 'view/pinned-nodes/set-active-node',
            payload: { id: nodes[targetIndex] },
        });
        return;
    }

    const currentIndex = nodes.indexOf(activeNodeId);
    let newIndex: number;

    if (direction === 'up') {
        newIndex = currentIndex > 0 ? currentIndex - 1 : 0;
    } else {
        newIndex = currentIndex < nodes.length - 1 ? currentIndex + 1 : nodes.length - 1;
    }

    // Only dispatch if actually changing
    if (nodes[newIndex] !== activeNodeId) {
        view.viewStore.dispatch({
            type: 'view/pinned-nodes/set-active-node',
            payload: { id: nodes[newIndex] },
        });
    }
};

/**
 * Checks if the sidebar is active (showing with pinned-cards or recent-cards tab).
 * Used for copy link to block and other sidebar-aware commands.
 */
export const isSidebarActive = (view: LineageView): boolean => {
    const viewState = view.viewStore.getValue();
    const settings = view.plugin.settings.getValue();

    const sidebarVisible = viewState.ui.controls.showLeftSidebar;
    const activeTab = settings.view.leftSidebarActiveTab;

    return sidebarVisible && (activeTab === 'pinned-cards' || activeTab === 'recent-cards');
};
