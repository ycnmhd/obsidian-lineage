import type Lineage from 'src/main';

/**
 * Move a card by `delta` positions within its category's card list. Used by
 * both the on-card up/down buttons and the move hotkeys in the global view.
 */
export const moveCardInCategory = (
    plugin: Lineage,
    categoryId: string,
    card: { filePath: string; section: string },
    delta: number,
) => {
    const globalCards =
        plugin.settings.getValue().categories.globalCards[categoryId] ?? [];
    const index = globalCards.findIndex(
        (c) =>
            c.filePath === card.filePath && c.section === card.section,
    );
    if (index === -1) return;
    const toIndex = Math.max(
        0,
        Math.min(globalCards.length - 1, index + delta),
    );
    if (toIndex === index) return;
    plugin.settings.dispatch({
        type: 'settings/categories/global/move-card',
        payload: {
            categoryId,
            filePath: card.filePath,
            section: card.section,
            toIndex,
        },
    });
};
