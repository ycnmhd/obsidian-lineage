import { LineageView } from 'src/view/view';
import {
    MenuItemObject,
    renderContextMenu,
} from 'src/obsidian/context-menu/render-context-menu';
import { selectInactiveCard } from 'src/obsidian/context-menu/select-inactive-card';
import { textIsSelected } from 'src/view/actions/context-menu/card-context-menu/helpers/text-is-selected';
import { createMultipleNodesContextMenu } from 'src/view/actions/context-menu/card-context-menu/create-multiple-nodes-context-menu';
import { createSidebarContextMenuItems } from 'src/view/actions/context-menu/card-context-menu/create-sidebar-context-menu-items';
import { createSingleNodeContextMenuItems } from 'src/view/actions/context-menu/card-context-menu/create-single-node-context-menu-items';

const getContextMenuContext = (
    view: LineageView,
    isInSidebar: boolean,
    isInRecentCardsList: boolean,
) => {
    const viewState = view.viewStore.getValue();
    const multipleNodesAreSelected =
        !isInSidebar && viewState.document.selectedNodes.size > 1;
    const documentStore = view.documentStore;
    const documentState = documentStore.getValue();
    // Use the appropriate active node based on context
    const activeNode = isInSidebar
        ? viewState.pinnedNodes.activeNode
        : viewState.document.activeNode;
    const isPinned =
        (isInSidebar && !isInRecentCardsList) ||
        documentState.pinnedNodes.Ids.includes(activeNode);

    const hasChildren = documentState.meta.groupParentIds.has(activeNode);
    return {
        activeNode,
        isPinned,
        isInSidebar,
        isInRecentCardsList,
        multipleNodesAreSelected,
        hasChildren,
    };
};

export const showNodeContextMenu = (event: MouseEvent, view: LineageView) => {
    const target = event.target as HTMLElement;
    const closestCardElement = target.closest(
        '.lineage-card',
    ) as HTMLElement | null;

    if (!closestCardElement) return;

    if (textIsSelected()) return;

    const isInSidebar = Boolean(target.closest('.sidebar'));
    const isInRecentCardsList =
        isInSidebar && Boolean(target.closest('.recent-cards-container'));

    const targetIsActive = closestCardElement.hasClass('active-node');
    if (!targetIsActive) {
        selectInactiveCard(
            view,
            closestCardElement,
            isInSidebar,
            isInRecentCardsList,
        );
    }

    const context = getContextMenuContext(
        view,
        isInSidebar,
        isInRecentCardsList,
    );
    let menuItems: MenuItemObject[];
    if (context.isInSidebar) {
        menuItems = createSidebarContextMenuItems(view, context);
    } else if (context.multipleNodesAreSelected) {
        menuItems = createMultipleNodesContextMenu(view);
    } else {
        menuItems = createSingleNodeContextMenuItems(view, context);
    }
    renderContextMenu(event, menuItems);
};
