import { FileHistoryState } from 'src/features/file-histoy/file-history-reducer';
import { findSnapshotIndex } from 'src/features/file-histoy/helpers/find-snapshot-index';
import { updateNavigationState } from 'src/features/file-histoy/helpers/update-navigation-state';

export type UndoRedoAction = {
    type: 'UNDO_REDO_SNAPSHOT';
    payload: {
        path: string;
        direction: 'back' | 'forward';
    };
};

export const undoRedoSnapshot = (
    state: FileHistoryState,
    action: UndoRedoAction,
) => {
    const document = state.documents[action.payload.path];

    if (!document || document.snapshots.length === 0) return;

    const currentIndex = findSnapshotIndex(
        document.snapshots,
        document.activeSnapshotId,
    );
    if (currentIndex === -1) {
        throw new Error(`active snapshot not found for ${action.payload.path}`);
    }

    let newIndex: number;
    if (action.payload.direction === 'back') {
        newIndex = currentIndex - 1;
    } else {
        newIndex = currentIndex + 1;
    }

    if (newIndex < 0 || newIndex >= document.snapshots.length) {
        return;
    }

    const newSnapshot = document.snapshots[newIndex];
    document.activeSnapshotId = newSnapshot.id;
    updateNavigationState(document);
};
