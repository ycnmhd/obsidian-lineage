import Lineage from 'src/main';
import { LineageView } from 'src/view/view';
import { getActiveLineageView } from 'src/obsidian/commands/helpers/get-active-lineage-view';
import { isSidebarActive } from 'src/view/actions/keyboard-shortcuts/helpers/commands/commands/helpers/sidebar-navigation';
import { getActiveGlobalCardContext } from 'src/view/components/global-categories/helpers/global-view-keyboard';
import { persistPinnedNodes } from 'src/stores/view/subscriptions/actions/persist-pinned-nodes';
import { globalCategoryValue } from 'src/stores/settings/types/global-categories-types';

export type AddTarget = {
    filePath: string;
    section: string;
    nodeId: string;
    // A real Lineage view, or the global view's virtual view cast as one.
    // Both expose `documentStore`, `plugin` and `file` in a compatible way.
    lineageView: LineageView;
};

/**
 * Resolve the card to be added to a global category, depending on which view
 * is currently focused:
 * - a Lineage view: the active document node, or the active sidebar pinned
 *   node when the sidebar is focused;
 * - the global categories view: the currently selected/highlighted card.
 * Returns null when no target card can be determined.
 */
export const resolveAddTarget = (plugin: Lineage): AddTarget | null => {
    const view = getActiveLineageView(plugin);
    if (view) {
        const viewState = view.viewStore.getValue();
        const isSidebar = isSidebarActive(view);
        const nodeId = isSidebar
            ? viewState.pinnedNodes.activeNode
            : viewState.document.activeNode;
        if (!nodeId) return null;
        const section =
            view.documentStore.getValue().sections.id_section[nodeId];
        if (!section) return null;
        return {
            filePath: view.file!.path,
            section,
            nodeId,
            lineageView: view,
        };
    }

    const globalContext = getActiveGlobalCardContext();
    if (globalContext) {
        return {
            filePath: globalContext.card.filePath,
            section: globalContext.card.section,
            nodeId: globalContext.card.nodeId,
            lineageView: globalContext.virtualView as unknown as LineageView,
        };
    }

    return null;
};

/**
 * Add the resolved card to the given global category. Always stores the
 * (filePath, section) ref so it shows up in the global categories view; when
 * the underlying card is pinned it also records the category on the node and
 * persists it (mirrors the sidebar context-menu behaviour).
 */
export const addCardToGlobalCategory = (
    plugin: Lineage,
    ctx: AddTarget,
    categoryId: string,
) => {
    plugin.settings.dispatch({
        type: 'settings/categories/global/add-card',
        payload: {
            categoryId,
            filePath: ctx.filePath,
            section: ctx.section,
        },
    });

    const documentState = ctx.lineageView.documentStore.getValue();
    if (documentState.pinnedNodes.Ids.includes(ctx.nodeId)) {
        ctx.lineageView.documentStore.dispatch({
            type: 'document/pinned-nodes/set-category',
            payload: {
                id: ctx.nodeId,
                category: globalCategoryValue(categoryId),
            },
        });
        persistPinnedNodes(ctx.lineageView);
    }
};
