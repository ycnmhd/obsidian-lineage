import {
    Column,
    DocumentInstanceState,
    NavigationHistory,
} from 'src/stores/view/view-state-type';
import { updateActiveNode } from 'src/stores/view/reducers/document/state/helpers/update-active-node';
import { updateNavigationState } from 'src/stores/view/reducers/history/helpers/update-navigation-state';

export type NavigationAction = {
    type: 'NAVIGATION/NAVIGATE_BACK' | 'NAVIGATION/NAVIGATE_FORWARD';
};

export const navigateActiveNode = (
    columns: Column[],
    state: DocumentInstanceState,
    navigation: NavigationHistory,
    forward = false,
) => {
    const activeIndex = navigation.state.activeIndex;
    const newIndex = forward ? activeIndex + 1 : activeIndex - 1;
    const newItem = navigation.items[newIndex];
    if (newItem) {
        navigation.state.activeIndex = newIndex;
        updateNavigationState(navigation);
        updateActiveNode(state, newItem);
    }
};
