import { ViewState } from 'src/stores/view/view-state-type';
import {
    AlignBranchState,
    alignElement,
} from 'src/stores/view/effects/helpers/align-element';
import { ViewStore } from 'src/view/view';
import { debounce } from 'obsidian';
import {
    historyEvents,
    navigationEvents,
    stateEvents,
    structureAndContentEvents,
} from 'src/stores/view/helpers/state-events';

const alignBranch = (
    state: ViewState,
    container: HTMLElement,
    behavior?: ScrollBehavior,
) => {
    if (!container) return;
    const nodeId = state.document.state.activeBranch.node;
    const localState: AlignBranchState = {
        columns: new Set<HTMLElement>(),
    };
    if (nodeId) {
        alignElement(container, nodeId, behavior, localState, 'both');
        for (const id of state.document.state.activeBranch.sortedParentNodes) {
            alignElement(container, id, behavior, localState);
        }
        for (const id of state.document.state.activeBranch.childGroups) {
            alignElement(container, 'group-' + id, behavior, localState);
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
        if (
            stateEvents.has(action.type) ||
            structureAndContentEvents.has(action.type) ||
            historyEvents.has(action.type) ||
            navigationEvents.has(action.type)
        ) {
            run(state, container);
        }
    });
};
