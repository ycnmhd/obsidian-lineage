import { FileHistoryState } from 'src/features/file-histoy/file-history-reducer';
import { updateNavigationState } from 'src/features/file-histoy/helpers/update-navigation-state';
import { findSnapshotIndex } from 'src/features/file-histoy/helpers/find-snapshot-index';

export type SelectSnapshotAction = {
    type: 'SELECT_SNAPSHOT';
    payload: {
        path: string;
        snapshotId: string;
    };
};

export const selectSnapshot = (
    state: FileHistoryState,
    action: SelectSnapshotAction,
) => {
    const document = state.documents[action.payload.path];

    if (document) {
        const index = findSnapshotIndex(
            document.snapshots,
            action.payload.snapshotId,
        );
        if (index !== -1) {
            document.state.activeIndex = index;
            updateNavigationState(document);
        }
    }
};
