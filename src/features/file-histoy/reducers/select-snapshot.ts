import { FileHistoryState } from 'src/features/file-histoy/file-history-reducer';
import { updateNavigationState } from 'src/features/file-histoy/helpers/update-navigation-state';

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
        const snapshot = document.snapshots.find(
            (s) => s.id === action.payload.snapshotId,
        );
        if (snapshot) document.activeSnapshotId = snapshot.id;
        updateNavigationState(document);
    }
};
