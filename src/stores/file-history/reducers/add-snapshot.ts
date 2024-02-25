import {
    FileHistoryState,
    Snapshot,
} from 'src/stores/file-history/file-history-reducer';
import { id } from 'src/helpers/id';
import { findSnapshotIndex } from 'src/stores/file-history/helpers/find-snapshot-index';
import { updateNavigationState } from 'src/stores/file-history/helpers/update-navigation-state';
import { NodePosition } from 'src/stores/document/helpers/find-branch';

const MAX_SNAPSHOTS = 50;

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
            snapshots: [],
            state: {
                canGoBack: false,
                canGoForward: false,
                activeIndex: 0,
            },
        };
        document = state.documents[action.payload.path];
    }

    const snapshots = document.snapshots;

    const activeSnapshot = snapshots[document.state.activeIndex];
    if (activeSnapshot?.data === action.payload.data) return;

    if (
        snapshots.length > 0 &&
        document.state.activeIndex !== snapshots.length - 1
    ) {
        console.log(
            'slicing',
            snapshots.length,
            document.state.activeIndex - 1,
        );
        // remove obsolete snapshots (between the active snapshot and the end)
        document.snapshots.splice(document.state.activeIndex + 1);
    }

    if (snapshots.length >= MAX_SNAPSHOTS) {
        const numSnapshotsToRemove = snapshots.length - MAX_SNAPSHOTS + 1;
        document.snapshots.splice(0, numSnapshotsToRemove);
        document.state.activeIndex = findSnapshotIndex(
            snapshots,
            activeSnapshot.id,
        );
    }
    const snapshot = {
        data: action.payload.data,
        created: Date.now(),
        id: id.snapshot(),
        position: action.payload.position,
        actionType: action.payload.actionType,
    } as Snapshot;

    if (snapshot.actionType === 'LOAD_DATA') {
        document.snapshots = [snapshot];
        document.state.activeIndex = 0;
    } else {
        snapshots.push(snapshot);
        document.state.activeIndex = snapshots.length - 1;
    }

    updateNavigationState(document);
};
