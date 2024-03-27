import {
    NavigationHistory,
    NodeId,
} from 'src/stores/document/document-state-type';
import { removeObsoleteHistoryItems } from 'src/stores/document/reducers/history/helpers/remove-obsolete-history-items';
import { removeOldHistoryItems } from 'src/stores/document/reducers/history/helpers/remove-old-history-items';
import { updateNavigationState } from 'src/stores/document/reducers/history/helpers/update-navigation-state';

export const addNavigationHistoryItem = (
    history: NavigationHistory,
    nodeId: NodeId,
) => {
    if (!nodeId) return;

    removeObsoleteHistoryItems(history);
    removeOldHistoryItems(history, 100);
    const activeItem = history.items[history.items.length - 1];
    if (activeItem !== nodeId) {
        history.items.push(nodeId);
    }

    history.state.activeIndex = history.items.length - 1;
    updateNavigationState(history);
};
