import { updateNavigationState } from 'src/stores/view/reducers/history/helpers/update-navigation-state';
import {
    DocumentHistory,
    DocumentState,
} from 'src/stores/view/view-state-type';
import { loadDocumentFromSnapshot } from 'src/stores/view/reducers/history/helpers/load-document-from-snapshot';

export type UndoRedoAction = {
    type: 'HISTORY/APPLY_PREVIOUS_SNAPSHOT' | 'HISTORY/APPLY_NEXT_SNAPSHOT';
};

export const undoAction = (
    document: DocumentState,
    history: DocumentHistory,
) => {
    const currentIndex = history.state.activeIndex;

    const newIndex = currentIndex - 1;
    const snapshot = history.items[newIndex];
    if (!snapshot) return;

    history.state.activeIndex = newIndex;
    updateNavigationState(history);
    loadDocumentFromSnapshot(document, snapshot);
};
