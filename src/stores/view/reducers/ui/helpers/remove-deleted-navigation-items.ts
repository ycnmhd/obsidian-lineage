import {
    Content,
    NavigationHistory,
    NodeId,
} from 'src/stores/document/document-state-type';
import { updateNavigationState } from 'src/stores/document/reducers/history/helpers/update-navigation-state';

export type RemoveObsoleteNavigationItemsAction = {
    type: 'NAVIGATION/REMOVE_OBSOLETE';
    payload: {
        content: Content;
    };
};
export const removeDeletedNavigationItems = (
    history: NavigationHistory,
    content: Content,
) => {
    const items: NodeId[] = [];
    let previous: NodeId | null = null;
    for (const item of history.items) {
        if (content.hasOwnProperty(item) && item !== previous) {
            items.push(item);
            previous = item;
        }
    }

    history.items = items;
    history.state.activeIndex = history.items.length - 1;
    updateNavigationState(history);
};
