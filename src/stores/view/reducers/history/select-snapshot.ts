import { updateNavigationState } from 'src/stores/view/reducers/history/helpers/update-navigation-state';
import { findSnapshotIndex } from 'src/stores/view/reducers/history/helpers/find-snapshot-index';
import {
    DocumentHistory,
    DocumentState,
} from 'src/stores/view/view-state-type';
import { loadDocumentFromSnapshot } from 'src/stores/view/reducers/history/helpers/load-document-from-snapshot';

export type SelectSnapshotAction = {
    type: 'HISTORY/SELECT_SNAPSHOT';
    payload: {
        path: string;
        snapshotId: string;
    };
};

export const selectSnapshot = (
    document: DocumentState,
    history: DocumentHistory,
    action: SelectSnapshotAction,
) => {
    const index = findSnapshotIndex(history.items, action.payload.snapshotId);
    if (index !== -1) {
        history.state.activeIndex = index;
        updateNavigationState(history);

        const snapshot = history.items[index];
        loadDocumentFromSnapshot(document, snapshot);
    }
};
