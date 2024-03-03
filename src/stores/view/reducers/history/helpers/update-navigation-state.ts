import { DocumentHistory } from 'src/stores/view/view-state-type';

export const updateNavigationState = (document: DocumentHistory) => {
    const activeIndex = document.state.activeIndex;

    document.state.canGoBack = activeIndex > 0;
    document.state.canGoForward = activeIndex < document.snapshots.length - 1;
};
