import Lineage from 'src/main';
import {
    GLOBAL_CATEGORIES_VIEW_TYPE,
} from 'src/obsidian/views/global-categories-view';

export const openGlobalCategoriesView = async (plugin: Lineage) => {
    const { workspace } = plugin.app;
    const existing = workspace.getLeavesOfType(GLOBAL_CATEGORIES_VIEW_TYPE);
    if (existing.length > 0) {
        await workspace.revealLeaf(existing[0]);
        return;
    }
    const leaf = workspace.getLeaf('tab');
    await leaf.setViewState({
        type: GLOBAL_CATEGORIES_VIEW_TYPE,
        active: true,
    });
};
