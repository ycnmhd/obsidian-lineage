import { NodeId } from 'src/stores/view/view-state-type';
import { ViewStore } from 'src/view/view';
import { debounce } from 'obsidian';
import { getViewEventType } from 'src/stores/view/helpers/get-view-event-type';
import { alignBranch } from 'src/stores/view/effects/align-branch-effect/helpers/align-branch/align-branch';

export const lastActiveNodeOfGroups: {
    [columnId: string]: {
        groupId: NodeId;
        nodeId: NodeId;
    };
} = {};

const run = debounce(alignBranch, 32);

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
            eventType.search
        ) {
            run(state, container);
        }
    });
};
