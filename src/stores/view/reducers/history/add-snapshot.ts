import { id } from 'src/helpers/id';
import { findSnapshotIndex } from 'src/stores/view/reducers/history/helpers/find-snapshot-index';
import { updateNavigationState } from 'src/stores/view/reducers/history/helpers/update-navigation-state';

import { NodePosition } from 'src/stores/view/helpers/search/find-node-position';
import {
    DocumentHistory,
    DocumentState,
    Snapshot,
} from 'src/stores/view/view-state-type';
import { DocumentAction, HistoryAction } from 'src/stores/view/view-reducer';

const MAX_SNAPSHOTS = 20;

export type AddSnapshotAction = {
    type: 'HISTORY/ADD_SNAPSHOT';
    payload: {
        path: string;
        data: string;
        position: NodePosition | null;
        actionType: string | null;
    };
};

export const addSnapshot = (
    document: DocumentState,
    history: DocumentHistory,
    action: DocumentAction | HistoryAction,
    reset = false,
) => {
    const snapshots = history.snapshots;

    const activeSnapshot = snapshots[history.state.activeIndex];

    if (
        snapshots.length > 0 &&
        history.state.activeIndex !== snapshots.length - 1
    ) {
        // remove obsolete snapshots (between the active snapshot and the end)
        history.snapshots.splice(history.state.activeIndex + 1);
    }

    if (snapshots.length >= MAX_SNAPSHOTS) {
        const numSnapshotsToRemove = snapshots.length - MAX_SNAPSHOTS + 1;
        history.snapshots.splice(0, numSnapshotsToRemove);
        history.state.activeIndex = findSnapshotIndex(
            snapshots,
            activeSnapshot.id,
        );
    }

    const snapshot = {
        // 🤮
        data: {
            columns: JSON.stringify(document.columns),
            content: JSON.stringify(document.content),
            state: JSON.stringify(document.state),
            sets: {
                childGroups: JSON.stringify([
                    ...document.state.activeBranch.childGroups,
                ]),
            },
        },
        created: Date.now(),
        id: id.snapshot(),
        actionType: action.type,
    } as Snapshot;

    if (reset) {
        history.snapshots = [snapshot];
        history.state.activeIndex = 0;
    } else {
        snapshots.push(snapshot);
        history.state.activeIndex = snapshots.length - 1;
    }

    updateNavigationState(history);
};
