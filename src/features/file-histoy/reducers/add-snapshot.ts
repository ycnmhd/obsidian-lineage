import {
    FileHistoryState,
    Snapshot,
} from 'src/features/file-histoy/file-history-reducer';
import { id } from 'src/helpers/id';
import { findSnapshotIndex } from 'src/features/file-histoy/helpers/find-snapshot-index';
import { updateNavigationState } from 'src/features/file-histoy/helpers/update-navigation-state';
import { NodePosition } from 'src/view/store/helpers/find-branch';

const MAX_SNAPSHOTS = 100;

export type AddSnapshotAction = {
    type: 'ADD_SNAPSHOT';
    payload: {
        path: string;
        data: string;
        position: NodePosition | null;
        actionType: string | null;
    };
};

export const addSnapshot = (
    state: FileHistoryState,
    action: AddSnapshotAction,
) => {
    if (action.payload.actionType === 'APPLY_SNAPSHOT') return;
    let document = state.documents[action.payload.path];
    if (!document) {
        state.documents[action.payload.path] = {
            activeSnapshotId: null,
            snapshots: [],
            state: {
                canGoBack: false,
                canGoForward: false,
            },
        };
        document = state.documents[action.payload.path];
    }

    const snapshots = document.snapshots;

    const activeSnapshotIndex = findSnapshotIndex(
        snapshots,
        document.activeSnapshotId,
    );

    if (
        activeSnapshotIndex >= 0 &&
        snapshots[activeSnapshotIndex].data === action.payload.data
    ) {
        return;
    }
    if (activeSnapshotIndex !== snapshots.length - 1) {
        // Remove obsolete snapshots (between the active snapshot and the end)
        snapshots.splice(activeSnapshotIndex + 1);
    }

    if (snapshots.length >= MAX_SNAPSHOTS) {
        const numSnapshotsToRemove = snapshots.length - MAX_SNAPSHOTS + 1;
        snapshots.splice(0, numSnapshotsToRemove);
    }

    const now = Date.now();
    // remove snapshots that less than n ms apart
    if (snapshots.length > 0) {
        const mostRecentSnapshot = snapshots[snapshots.length - 1];
        const timeDifference = now - mostRecentSnapshot.created;
        if (timeDifference < 16) {
            snapshots.pop();
        }
    }
    const snapshot = {
        data: action.payload.data,
        created: Date.now(),
        id: id.snapshot(),
        position: action.payload.position,
        actionType: action.payload.actionType,
    } as Snapshot;
    snapshots.push(snapshot);
    document.activeSnapshotId = snapshot.id;
    updateNavigationState(document);
};
