import { updateNavigationState } from 'src/stores/document/reducers/history/helpers/update-navigation-state';

import { NodePosition } from 'src/stores/view/helpers/search/find-node-position';
import {
    DocumentHistory,
    LineageDocument,
    NodeId,
} from 'src/stores/document/document-state-type';
import { createSnapshot } from 'src/stores/document/reducers/history/helpers/create-snapshot';
import { UndoableAction } from 'src/stores/document/document-store-actions';
import { removeOldHistoryItems } from 'src/stores/document/reducers/history/helpers/remove-old-history-items';
import { removeObsoleteHistoryItems } from 'src/stores/document/reducers/history/helpers/remove-obsolete-history-items';

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
    document: LineageDocument,
    history: DocumentHistory,
    action: UndoableAction,
    activeNodeId: NodeId,
) => {
    const items = history.items;

    const activeIndex = history.state.activeIndex;
    const activeSnapshot = items[activeIndex];
    removeObsoleteHistoryItems(history);
    removeOldHistoryItems(history);
    // identical content after loading a file
    if (activeSnapshot && action.type === 'DOCUMENT/LOAD_FILE') {
        const snapshotContent = JSON.stringify(
            Object.values(JSON.parse(activeSnapshot.data.content)),
        );
        const documentContent = JSON.stringify(Object.values(document.content));

        if (snapshotContent === documentContent) {
            history.items.splice(history.state.activeIndex, 1);
        }
    }
    if (activeSnapshot) {
        activeSnapshot.data.activeNodeId = activeNodeId;
    }
    const snapshot = createSnapshot(document, action, activeNodeId);
    items.push(snapshot);
    history.state.activeIndex = items.length - 1;
    history.context.activeNodeId = activeNodeId;
    updateNavigationState(history);
};
