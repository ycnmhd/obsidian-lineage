import { LineageView } from 'src/view/view';
import { derived } from 'svelte/store';
import {
    getCategoryEntries,
} from 'src/view/components/global-categories/helpers/tree-utils';
import { globalCategoryValue } from 'src/stores/settings/types/global-categories-types';

export const FilteredPinnedNodesStore = (view: LineageView) => {
    const documentPinnedNodes = derived(
        view.documentStore,
        (state) => state.pinnedNodes,
    );
    const viewActiveCategory = derived(
        view.viewStore,
        (state) => state.pinnedNodes.activeCategory,
    );
    const settingsCategories = derived(
        view.plugin.settings,
        (state) => state.categories,
    );

    return derived(
        [documentPinnedNodes, viewActiveCategory, settingsCategories],
        ([pinnedNodes, activeCategory, categories]) => {
            const globalEntries = getCategoryEntries(categories.tree);
            // when the global categories feature is disabled, the global
            // entries must not be selectable in the sidebar (cards already
            // assigned to them stay pinned, they're just not offered as a
            // filter anymore)
            const globalEnabled = categories.globalCategoriesEnabled;
            const visibleGlobalEntries = globalEnabled ? globalEntries : [];

            // Merge global (shown with display path) and file-specific categories
            const allCategories = Array.from(
                new Set([
                    ...visibleGlobalEntries.map((e) => e.path),
                    ...pinnedNodes.fileCategories,
                ]),
            );

            // Resolve the active filter to the value stored in nodeToCategory:
            // global entries match by id, file-specific ones by name
            let activeValue: string | null = null;
            if (activeCategory !== 'all' && activeCategory !== 'uncategorized') {
                const entry = globalEntries.find(
                    (e) => e.path === activeCategory,
                );
                activeValue = entry
                    ? globalCategoryValue(entry.id)
                    : activeCategory;
            }

            let filteredIds = pinnedNodes.Ids;

            if (activeCategory === 'uncategorized') {
                // Show only nodes without a category
                filteredIds = pinnedNodes.Ids.filter(
                    (id: string) => !pinnedNodes.nodeToCategory[id],
                );
            } else if (activeCategory !== 'all') {
                // Show only nodes with the selected category
                filteredIds = pinnedNodes.Ids.filter(
                    (id: string) => pinnedNodes.nodeToCategory[id] === activeValue,
                );
            }

            return {
                nodes: filteredIds,
                categories: allCategories,
                globalEntries: visibleGlobalEntries,
            };
        },
    );
};
