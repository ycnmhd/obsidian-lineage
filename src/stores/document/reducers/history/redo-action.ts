import {
    DocumentHistory,
    LineageDocument,
} from 'src/stores/document/document-state-type';
import { loadDocumentFromSnapshot } from 'src/stores/document/reducers/history/helpers/load-document-from-snapshot';
import { updateNavigationState } from 'src/stores/document/reducers/history/helpers/update-navigation-state';

export const redoAction = (
    document: LineageDocument,
    history: DocumentHistory,
) => {
    const currentIndex = history.state.activeIndex;

    const nexIndex = currentIndex + 1;
    const snapshot = history.items[nexIndex];
    if (!snapshot) return;

    history.state.activeIndex = nexIndex;
    updateNavigationState(history);
    loadDocumentFromSnapshot(document, snapshot, history);
};
