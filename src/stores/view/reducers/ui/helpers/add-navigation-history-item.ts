import {
    Content,
    NavigationHistory,
    NodeId,
} from 'src/stores/view/view-state-type';
import { removeObsoleteHistoryItems } from 'src/stores/view/reducers/history/helpers/remove-obsolete-history-items';
import { removeOldHistoryItems } from 'src/stores/view/reducers/history/helpers/remove-old-history-items';
import { updateNavigationState } from 'src/stores/view/reducers/history/helpers/update-navigation-state';

export const addNavigationHistoryItem = (
    history: NavigationHistory,
    content: Content,
    nodeId: NodeId,
) => {
    if (!nodeId) return;

    const items: NodeId[] = [];
    let previous: NodeId | null = null;
    for (const item of history.items) {
        if (content.hasOwnProperty(item) && item !== previous) {
            items.push(item);
            previous = item;
        }
    }

    history.items = items;
    const activeItem = history.items[history.items.length - 1];
    if (activeItem !== nodeId) {
        removeObsoleteHistoryItems(history);
        removeOldHistoryItems(history, 100);
        history.items.push(nodeId);
    }

    history.state.activeIndex = history.items.length - 1;
    updateNavigationState(history);
};
