import { LineageView } from 'src/view/view';
import { MenuItemObject } from 'src/obsidian/context-menu/render-context-menu';
import { lang } from 'src/lang/lang';
import { copyLinkToBlock } from 'src/view/actions/context-menu/card-context-menu/helpers/copy-link-to-block';
import { copyActiveNodesToClipboard } from 'src/view/actions/keyboard-shortcuts/helpers/commands/commands/helpers/clipboard/copy-active-nodes-to-clipboard';
import { persistPinnedNodes } from 'src/stores/view/subscriptions/actions/persist-pinned-nodes';
import { NewCategoryModal } from 'src/view/modals/new-category-modal/new-category-modal';
import { revealInMainView } from 'src/view/actions/context-menu/card-context-menu/helpers/reveal-in-main-view';
import {
    globalCategoryValue,
    isGlobalCategoryValue,
} from 'src/stores/settings/types/global-categories-types';
import { GlobalCategoryNode } from 'src/stores/settings/types/global-categories-types';

export const togglePinNode = (
    view: LineageView,
    activeNode: string,
    isPinned: boolean,
    isInSidebar: boolean,
) => {
    const viewState = view.viewStore.getValue();
    const id = isInSidebar ? viewState.pinnedNodes.activeNode : activeNode;
    view.documentStore.dispatch({
        type: isPinned
            ? 'document/pinned-nodes/unpin'
            : 'document/pinned-nodes/pin',
        payload: { id: id },
    });
};

/** Assign/remove the global category on a node. */
const toggleGlobalCategory = (
    view: LineageView,
    activeNode: string,
    categoryId: string,
) => {
    const value = globalCategoryValue(categoryId);
    const docState = view.documentStore.getValue();
    const current = docState.pinnedNodes.nodeToCategory[activeNode];
    const section = docState.sections.id_section[activeNode];
    const filePath = view.file?.path;

    if (current === value) {
        view.documentStore.dispatch({
            type: 'document/pinned-nodes/remove-category',
            payload: { id: activeNode },
        });
        // remove the card from the global category as well
        if (section && filePath) {
            view.plugin.settings.dispatch({
                type: 'settings/categories/global/remove-card',
                payload: { categoryId, filePath, section },
            });
        }
    } else {
        view.documentStore.dispatch({
            type: 'document/pinned-nodes/set-category',
            payload: { id: activeNode, category: value },
        });
        // add the card to the global category (stable (filePath, section) ref)
        if (section && filePath) {
            view.plugin.settings.dispatch({
                type: 'settings/categories/global/add-card',
                payload: { categoryId, filePath, section },
            });
        }
    }
    persistPinnedNodes(view);
};

/** Build a nested submenu that mirrors the global category tree. */
const createGlobalCategorySubmenu = (
    view: LineageView,
    activeNode: string,
    nodes: GlobalCategoryNode[],
): MenuItemObject[] => {
    const documentState = view.documentStore.getValue();
    const currentValue = documentState.pinnedNodes.nodeToCategory[activeNode];

    const items: MenuItemObject[] = [];
    for (const node of nodes) {
        if (node.type === 'folder') {
            items.push({
                title: node.name,
                icon: 'folder',
                submenu: createGlobalCategorySubmenu(
                    view,
                    activeNode,
                    node.children,
                ),
            });
        } else {
            const value = globalCategoryValue(node.id);
            items.push({
                title: node.name,
                icon: 'tag',
                checked: currentValue === value,
                action: () => toggleGlobalCategory(view, activeNode, node.id),
            });
        }
    }
    return items;
};

export const createCategorySubmenu = (
    view: LineageView,
    activeNode: string,
): MenuItemObject[] => {
    const documentState = view.documentStore.getValue();
    const settingsState = view.plugin.settings.getValue();
    const pinnedNodes = documentState.pinnedNodes;
    const fileCategories = pinnedNodes.fileCategories.filter(
        (c) => !isGlobalCategoryValue(c),
    );
    const globalTree = settingsState.categories.tree;
    const currentCategory = pinnedNodes.nodeToCategory[activeNode];

    const items: MenuItemObject[] = [];

    // Global categories section (only when the feature is enabled)
    if (settingsState.categories.globalCategoriesEnabled) {
        const globalItems = createGlobalCategorySubmenu(
            view,
            activeNode,
            globalTree,
        );
        if (globalItems.length > 0) {
            items.push({
                title: lang.cm_global_categories,
                icon: 'globe',
                submenu: globalItems,
            });
            items.push({ type: 'separator' });
        }
    }

    // File-specific categories
    for (const category of fileCategories) {
        items.push({
            title: category,
            icon: 'tag',
            checked: currentCategory === category,
            action: () => {
                // Re-read current category at execution time
                const docState = view.documentStore.getValue();
                const nodeCategory =
                    docState.pinnedNodes.nodeToCategory[activeNode];
                if (nodeCategory === category) {
                    // Remove category if already assigned
                    view.documentStore.dispatch({
                        type: 'document/pinned-nodes/remove-category',
                        payload: { id: activeNode },
                    });
                } else {
                    view.documentStore.dispatch({
                        type: 'document/pinned-nodes/set-category',
                        payload: { id: activeNode, category },
                    });
                }
                persistPinnedNodes(view);
            },
        });
    }

    // Add separator before "Create new"
    if (items.length > 0) {
        items.push({ type: 'separator' });
    }

    // Add "Create new category" option (always file-specific; global
    // categories are created in the global categories window)
    items.push({
        title: lang.cm_create_category,
        icon: 'plus',
        action: async () => {
            const modal = new NewCategoryModal({ plugin: view.plugin });
            const name = await modal.open();
            if (name && name.trim()) {
                const trimmedName = name.trim();
                view.documentStore.dispatch({
                    type: 'document/pinned-nodes/add-category',
                    payload: { name: trimmedName },
                });
                view.documentStore.dispatch({
                    type: 'document/pinned-nodes/set-category',
                    payload: { id: activeNode, category: trimmedName },
                });
                persistPinnedNodes(view);
            }
        },
    });

    // Add "Remove category" option if node has one
    if (currentCategory) {
        items.push({ type: 'separator' });
        items.push({
            title: lang.cm_remove_category,
            icon: 'trash-2',
            action: () => {
                view.documentStore.dispatch({
                    type: 'document/pinned-nodes/remove-category',
                    payload: { id: activeNode },
                });
                persistPinnedNodes(view);
            },
        });

        // Add "Delete category" option (only for file-specific categories)
        // Global categories can never be deleted from the sidebar
        if (!isGlobalCategoryValue(currentCategory)) {
            items.push({
                title: lang.cm_delete_category,
                icon: 'trash-2',
                dangerous: true,
                action: () => {
                    // Re-read current category at execution time
                    const docState = view.documentStore.getValue();
                    const nodeCategory =
                        docState.pinnedNodes.nodeToCategory[activeNode];
                    if (nodeCategory) {
                        view.documentStore.dispatch({
                            type: 'document/pinned-nodes/delete-category',
                            payload: { name: nodeCategory },
                        });
                        // Reset active category if it was the deleted one
                        const viewState = view.viewStore.getValue();
                        if (
                            viewState.pinnedNodes.activeCategory ===
                            nodeCategory
                        ) {
                            view.viewStore.dispatch({
                                type: 'view/pinned-nodes/set-active-category',
                                payload: { category: 'all' },
                            });
                        }
                    }
                    persistPinnedNodes(view);
                },
            });
        }
    }

    return items;
};

type Props = {
    activeNode: string;
    isPinned: boolean;
    isInRecentCardsList: boolean;
};
export const createSidebarContextMenuItems = (
    view: LineageView,
    { isPinned, activeNode, isInRecentCardsList }: Props,
) => {
    const menuItems: MenuItemObject[] = [
        {
            title: lang.cm_copy_link_to_block,
            icon: 'links-coming-in',
            action: () => copyLinkToBlock(view, true),
        },
        { type: 'separator' },
        {
            title: lang.cm_copy,
            icon: 'documents',
            action: () => copyActiveNodesToClipboard(view, true),
        },

        { type: 'separator' },
        {
            title: lang.cm_category,
            icon: 'tag',
            submenu: createCategorySubmenu(view, activeNode),
        },
        { type: 'separator' },
        // Reveal in the main document view. Pinned cards only (the recent
        // cards list is not in the main document hierarchy the same way).
        ...(isInRecentCardsList
            ? []
            : [
                  {
                      title: lang.cm_reveal_in_main_view,
                      icon: 'pin',
                      action: () => revealInMainView(view, activeNode),
                  },
              ]),
        {
            title: isPinned
                ? lang.cm_unpin_from_left_sidebar
                : lang.cm_pin_in_left_sidebar,
            icon: isPinned ? 'pin-off' : 'pin',
            action: () => togglePinNode(view, activeNode, isPinned, true),
            disabled: isInRecentCardsList,
        },
        { type: 'separator' },
    ];
    return menuItems;
};
