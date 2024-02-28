import { FileHistoryState } from 'src/stores/file-history/file-history-reducer';
import { updateNavigationState } from 'src/stores/file-history/helpers/update-navigation-state';

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

    const currentIndex = document.state.activeIndex;

    let newIndex: number;
    if (action.payload.direction === 'back') {
        newIndex = currentIndex - 1;
    } else {
        newIndex = currentIndex + 1;
    }

    if (newIndex < 0 || newIndex >= document.snapshots.length) {
        return;
    }

    document.state.activeIndex = newIndex;
    updateNavigationState(document);
};
