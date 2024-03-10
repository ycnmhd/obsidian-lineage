import { NodeId } from 'src/stores/view/view-state-type';
import { ViewStore } from 'src/view/view';
import { getViewEventType } from 'src/stores/view/helpers/get-view-event-type';
import { alignBranch } from 'src/stores/view/effects/view/align-branch-effect/helpers/align-branch/align-branch';
import { debounce } from 'obsidian';

export const lastActiveNodeOfGroups: {
    [columnId: string]: {
        groupId: NodeId;
        nodeId: NodeId;
    };
} = {};

const debounced = debounce(alignBranch, 32);

export const alignBranchEffect = (store: ViewStore, container: HTMLElement) => {
    alignBranch(store.getValue(), container);
    return store.subscribe((state, action) => {
        if (!action) return;
        const eventType = getViewEventType(action.type);
        if (
            eventType.activeNode ||
            eventType.creationAndDeletion ||
            eventType.shape ||
            eventType.changeHistory ||
            eventType.activeNodeHistory ||
            eventType.search ||
            eventType.zoom
        ) {
            debounced(state, container);
        }
    });
};
