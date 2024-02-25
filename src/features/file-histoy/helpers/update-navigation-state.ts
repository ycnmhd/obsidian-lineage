import { FileHistory } from 'src/features/file-histoy/file-history-reducer';

export const updateNavigationState = (document: FileHistory) => {
    const activeIndex = document.state.activeIndex;

    document.state.canGoBack = activeIndex > 0;
    document.state.canGoForward = activeIndex < document.snapshots.length - 1;
};
