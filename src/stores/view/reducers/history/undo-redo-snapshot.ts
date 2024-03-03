import { updateNavigationState } from 'src/stores/view/reducers/history/helpers/update-navigation-state';
import {
    DocumentHistory,
    DocumentState,
} from 'src/stores/view/view-state-type';
import { loadDocumentFromSnapshot } from 'src/stores/view/reducers/history/helpers/load-document-from-snapshot';

export type UndoRedoAction = {
    type: 'HISTORY/UNDO_REDO_SNAPSHOT';
    payload: {
        path: string;
        direction: 'back' | 'forward';
    };
};

export const undoRedoSnapshot = (
    document: DocumentState,
    history: DocumentHistory,
    action: UndoRedoAction,
) => {
    if (!history || history.snapshots.length === 0) return;

    const currentIndex = history.state.activeIndex;

    let newIndex: number;
    if (action.payload.direction === 'back') {
        newIndex = currentIndex - 1;
    } else {
        newIndex = currentIndex + 1;
    }

    if (newIndex < 0 || newIndex >= history.snapshots.length) {
        return;
    }

    history.state.activeIndex = newIndex;
    updateNavigationState(history);
    const snapshot = history.snapshots[newIndex];
    loadDocumentFromSnapshot(document, snapshot);
};
