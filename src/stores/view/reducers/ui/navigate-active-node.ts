import { NavigationHistory } from 'src/stores/document/document-state-type';
import { updateActiveNode } from 'src/stores/view/reducers/document/helpers/update-active-node';
import { updateNavigationState } from 'src/stores/document/reducers/history/helpers/update-navigation-state';
import { DocumentViewState } from 'src/stores/view/view-state-type';

import { RemoveObsoleteNavigationItemsAction } from 'src/stores/view/reducers/ui/helpers/remove-deleted-navigation-items';

export type NavigationAction =
    | {
          type: 'NAVIGATION/NAVIGATE_BACK' | 'NAVIGATION/NAVIGATE_FORWARD';
      }
    | RemoveObsoleteNavigationItemsAction;

export const navigateActiveNode = (
    state: DocumentViewState,
    navigation: NavigationHistory,
    forward = false,
) => {
    const activeIndex = navigation.state.activeIndex;
    const newIndex = forward ? activeIndex + 1 : activeIndex - 1;
    const newItem = navigation.items[newIndex];
    if (newItem) {
        navigation.state.activeIndex = newIndex;
        updateNavigationState(navigation);
        updateActiveNode(state, newItem, null);
    }
};
