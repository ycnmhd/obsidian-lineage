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
    const activeItem = history.items[history.state.activeIndex];
    if (activeItem === nodeId) return;

    history.items = history.items.filter((item) =>
        content.hasOwnProperty(item),
    );
    removeObsoleteHistoryItems(history);
    removeOldHistoryItems(history, 100);

    history.items.push(nodeId);
    history.state.activeIndex = history.items.length - 1;

    updateNavigationState(history);
};
