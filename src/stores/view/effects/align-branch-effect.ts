import { NodeId, ViewState } from 'src/stores/view/view-state-type';
import {
    AlignBranchState,
    alignElement,
} from 'src/stores/view/effects/helpers/align-element';
import { ViewStore } from 'src/view/view';
import { debounce } from 'obsidian';
import { getViewEventType } from 'src/stores/view/helpers/get-view-event-type';

const lastActiveNodeOfGroups: Record<NodeId, NodeId> = {};

const alignBranch = (
    state: ViewState,
    container: HTMLElement,
    behavior?: ScrollBehavior,
) => {
    if (!container) return;
    const nodeId = state.document.state.activeNode;
    const localState: AlignBranchState = {
        columns: new Set<HTMLElement>(),
    };
    if (nodeId) {
        const group = state.ui.state.activeBranch.group;
        lastActiveNodeOfGroups[group] = nodeId;
        alignElement(container, nodeId, behavior, localState, 'both');
        for (const id of state.ui.state.activeBranch.sortedParentNodes) {
            alignElement(container, id, behavior, localState);
        }
        for (const id of state.ui.state.activeBranch.childGroups) {
            const lastActiveNodeOfGroup = lastActiveNodeOfGroups[id];
            if (lastActiveNodeOfGroup) {
                alignElement(
                    container,
                    lastActiveNodeOfGroup,
                    behavior,
                    localState,
                );
            } else {
                alignElement(container, 'group-' + id, behavior, localState);
            }
        }
    }
    for (const column of state.document.columns) {
        const nodes = column.groups.map((g) => g.nodes).flat();
        if (nodes.length > 0)
            alignElement(
                container,
                nodes[nodes.length - 1],
                behavior,
                localState,
            );
    }
};
const run = debounce(alignBranch, 32);
export const alignBranchEffect = (store: ViewStore, container: HTMLElement) => {
    alignBranch(store.getValue(), container);
    return store.subscribe((state, action) => {
        if (!action) return;
        const eventType = getViewEventType(action.type);
        if (
            eventType.activeNode ||
            eventType.structureAndContent ||
            eventType.changeHistory ||
            eventType.activeNodeHistory
        ) {
            run(state, container);
        }
    });
};
