import { LineageView } from 'src/view/view';
import { get } from 'svelte/store';
import { FilteredPinnedNodesStore } from 'src/stores/document/derived/filtered-pinned-nodes-store';

/**
 * Reveal a pinned card in the left sidebar: shows the sidebar when it is
 * hidden, switches to the pinned-cards tab when another tab is active,
 * resets the category filter when it would hide the card, and sets the
 * card as the active pinned node. The pinned-cards sidebar highlights the
 * active node and scrolls it into view automatically
 * (see scrollActivePinnedNode).
 */
export const revealInLeftSidebar = (view: LineageView, nodeId: string) => {
    const documentState = view.documentStore.getValue();
    if (!documentState.pinnedNodes.Ids.includes(nodeId)) return;

    const viewState = view.viewStore.getValue();
    const settings = view.plugin.settings.getValue();

    // 1. Show the left sidebar if it is hidden
    if (!viewState.ui.controls.showLeftSidebar) {
        view.viewStore.dispatch({ type: 'view/left-sidebar/toggle' });
    }

    // 2. Switch to the pinned-cards tab if another tab is active
    if (settings.view.leftSidebarActiveTab !== 'pinned-cards') {
        view.plugin.settings.dispatch({
            type: 'view/left-sidebar/set-active-tab',
            payload: { tab: 'pinned-cards' },
        });
    }

    // 3. Reset the category filter if it would hide the card
    const filteredPinnedNodes = get(FilteredPinnedNodesStore(view));
    if (!filteredPinnedNodes.nodes.includes(nodeId)) {
        view.viewStore.dispatch({
            type: 'view/pinned-nodes/set-active-category',
            payload: { category: 'all' },
        });
    }

    // 4. Focus the card in the sidebar
    view.viewStore.dispatch({
        type: 'view/pinned-nodes/set-active-node',
        payload: { id: nodeId },
    });
};