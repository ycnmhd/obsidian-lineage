import {
    DocumentHistory,
    NavigationHistory,
} from 'src/stores/document/document-state-type';

export const updateNavigationState = (
    document: DocumentHistory | NavigationHistory,
) => {
    const activeIndex = document.state.activeIndex;

    document.state.canGoBack = activeIndex > 0;
    document.state.canGoForward = activeIndex < document.items.length - 1;
};
