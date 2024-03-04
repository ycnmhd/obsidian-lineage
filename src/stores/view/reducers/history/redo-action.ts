import {
    DocumentHistory,
    DocumentState,
} from 'src/stores/view/view-state-type';
import { loadDocumentFromSnapshot } from 'src/stores/view/reducers/history/helpers/load-document-from-snapshot';
import { updateNavigationState } from 'src/stores/view/reducers/history/helpers/update-navigation-state';

export const redoAction = (
    document: DocumentState,
    history: DocumentHistory,
) => {
    const currentIndex = history.state.activeIndex;

    const nexIndex = currentIndex + 1;
    const snapshot = history.snapshots[nexIndex];
    if (!snapshot) return;

    history.state.activeIndex = nexIndex;
    updateNavigationState(history);
    loadDocumentFromSnapshot(document, snapshot);
};
