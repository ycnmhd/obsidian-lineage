import { FileHistory } from 'src/features/file-histoy/file-history-reducer';
import { findSnapshotIndex } from 'src/features/file-histoy/helpers/find-snapshot-index';

export const updateNavigationState = (document: FileHistory) => {
    const activeIndex = findSnapshotIndex(
        document.snapshots,
        document.activeSnapshotId,
    );
    if (activeIndex === -1) {
        document.state.canGoBack = false;
        document.state.canGoForward = false;
    } else {
        document.state.canGoBack = activeIndex > 0;
        document.state.canGoForward =
            activeIndex < document.snapshots.length - 1;
    }
};
