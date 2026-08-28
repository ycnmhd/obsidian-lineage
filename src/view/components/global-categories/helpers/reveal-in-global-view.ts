import type Lineage from 'src/main';
import { writable } from 'svelte/store';
import { openGlobalCategoriesView } from 'src/obsidian/events/workspace/effects/open-global-categories-view';

/**
 * A request to select a category in the global categories view and scroll to
 * a specific card within it. Set by external entry points (currently the
 * "add to global category" modal's "Reveal in global view" action); consumed
 * by the mounted `global-categories.svelte` component, which clears it after
 * applying.
 */
export type GlobalRevealRequest = {
    categoryId: string;
    filePath: string;
    section: string;
};

export const globalRevealRequestStore = writable<GlobalRevealRequest | null>(
    null,
);

/**
 * Select the given category in the global categories view and scroll to the
 * card identified by (filePath, section). Opens the view first if it isn't
 * already open; otherwise it is revealed and the mounted component scrolls to
 * the card.
 */
export const revealCardInGlobalView = async (
    plugin: Lineage,
    request: GlobalRevealRequest,
) => {
    globalRevealRequestStore.set(request);
    await openGlobalCategoriesView(plugin);
};
