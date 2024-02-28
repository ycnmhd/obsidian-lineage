import { FileHistoryState } from 'src/stores/file-history/file-history-reducer';
import { updateNavigationState } from 'src/stores/file-history/helpers/update-navigation-state';
import { findSnapshotIndex } from 'src/stores/file-history/helpers/find-snapshot-index';

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
