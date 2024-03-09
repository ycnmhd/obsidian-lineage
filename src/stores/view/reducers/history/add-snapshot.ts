import { updateNavigationState } from 'src/stores/view/reducers/history/helpers/update-navigation-state';

import { NodePosition } from 'src/stores/view/helpers/search/find-node-position';
import {
    DocumentHistory,
    DocumentInstanceState,
    DocumentState,
    NodeId,
} from 'src/stores/view/view-state-type';
import { createSnapshot } from 'src/stores/view/reducers/history/helpers/create-snapshot';
import { UndoableAction } from 'src/stores/view/view-store-actions';
import { removeOldHistoryItems } from 'src/stores/view/reducers/history/helpers/remove-old-history-items';
import { removeObsoleteHistoryItems } from 'src/stores/view/reducers/history/helpers/remove-obsolete-history-items';

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
    action: UndoableAction,
    previousActiveNodeId: NodeId,
) => {
    const items = history.items;

    const activeIndex = history.state.activeIndex;
    const activeItem = items[activeIndex];
    removeObsoleteHistoryItems(history);
    removeOldHistoryItems(history);
    // consecutive LOAD_FILE events
    if (activeItem && action.type === 'DOCUMENT/LOAD_FILE') {
        const content = JSON.parse(activeItem.data.content);
        const snapshotContent = JSON.stringify(Object.values(content));
        const documentContent = JSON.stringify(Object.values(document.content));
        if (snapshotContent === documentContent) return;
    }

    const mostRecentSnapshot = items[history.state.activeIndex];
    if (mostRecentSnapshot) {
        mostRecentSnapshot.data.state = JSON.stringify({
            activeNode: previousActiveNodeId,
        } satisfies DocumentInstanceState);
    }
    const snapshot = createSnapshot(document, action);
    items.push(snapshot);
    history.state.activeIndex = items.length - 1;

    updateNavigationState(history);
};
