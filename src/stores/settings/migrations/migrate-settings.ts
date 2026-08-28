import { Settings } from 'src/stores/settings/settings-type';
import { Settings_0_5_4 } from 'src/stores/settings/migrations/old-settings-type';
import { id } from 'src/helpers/id';
import { GlobalCategoryNode } from 'src/stores/settings/types/global-categories-types';

export const migrateSettings = (settings: Settings | Settings_0_5_4) => {
    for (const [path, pref] of Object.entries(settings.documents)) {
        if (typeof pref === 'boolean') {
            settings.documents[path] = {
                documentFormat: 'sections',
                viewType: 'lineage',
                activeSection: null,
                pinnedSections: null,
                outline: null,
            };
        }
    }

    if ('backup' in settings) {
        // @ts-ignore
        delete settings.backup;
    }

    migrateGlobalCategories(settings as Settings);
    migrateGlobalCategoriesFlag(settings as Settings);
};

/** Ensure the sidebar toggle flag exists (defaults to enabled). */
const migrateGlobalCategoriesFlag = (settings: Settings) => {
    const categories = settings.categories;
    if (!categories) return;
    if (typeof categories.globalCategoriesEnabled !== 'boolean') {
        categories.globalCategoriesEnabled = true;
    }
};

/**
 * Old settings stored global categories as a flat list of names
 * (`categories.globalCategories`). The new model is a tree of nodes with
 * stable ids + a per-category card map. Convert the flat list into root-level
 * category nodes and drop the old key.
 */
const migrateGlobalCategories = (settings: Settings) => {
    const categories = settings.categories as Settings['categories'] & {
        globalCategories?: string[];
    };
    if (!categories || !Array.isArray(categories.globalCategories)) return;

    const legacyNames = categories.globalCategories;
    const tree: GlobalCategoryNode[] = legacyNames.map((name) => ({
        id: id.globalCategory(),
        name,
        type: 'category',
        parentId: null,
        children: [],
    }));

    if (tree.length > 0) {
        categories.tree = tree;
    }
    if (!categories.globalCards) {
        categories.globalCards = {};
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (categories as any).globalCategories;
};
