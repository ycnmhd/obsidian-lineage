import { updateNavigationState } from 'src/stores/document/reducers/history/helpers/update-navigation-state';
import { findSnapshotIndex } from 'src/stores/document/reducers/history/helpers/find-snapshot-index';
import {
    DocumentHistory,
    LineageDocument,
} from 'src/stores/document/document-state-type';
import { loadDocumentFromSnapshot } from 'src/stores/document/reducers/history/helpers/load-document-from-snapshot';

export type SelectSnapshotAction = {
    type: 'HISTORY/SELECT_SNAPSHOT';
    payload: {
        path: string;
        snapshotId: string;
    };
};

export const selectSnapshot = (
    document: LineageDocument,
    history: DocumentHistory,
    action: SelectSnapshotAction,
) => {
    const index = findSnapshotIndex(history.items, action.payload.snapshotId);
    if (index !== -1) {
        history.state.activeIndex = index;
        updateNavigationState(history);

        const snapshot = history.items[index];
        loadDocumentFromSnapshot(document, snapshot, history);
    }
};
