import { ViewState } from 'src/stores/view/view-state-type';
import {
    AlignBranchState,
    alignElement,
} from 'src/stores/view/effects/view/align-branch-effect/helpers/align-branch/helpers/align-element';
import { lastActiveNodeOfGroups } from 'src/stores/view/effects/view/align-branch-effect/align-branch-effect';
import { getNodeElement } from 'src/stores/view/effects/view/align-branch-effect/helpers/align-branch/helpers/get-node-element';

export const alignParentsAndActiveNode = (
    state: ViewState,
    container: HTMLElement,
    localState: AlignBranchState,
    behavior?: ScrollBehavior,
) => {
    const group = state.ui.state.activeBranch.group;
    lastActiveNodeOfGroups[state.ui.state.activeBranch.column] = {
        nodeId: state.document.state.activeNode,
        groupId: group,
    };
    const element = getNodeElement(container, state.document.state.activeNode);
    if (element) {
        const columnId = alignElement(container, element, behavior, 'both');
        if (columnId) localState.columns.add(columnId);
    }
    for (const id of state.ui.state.activeBranch.sortedParentNodes) {
        const element = getNodeElement(container, id);
        if (element) {
            const columnId = alignElement(container, element, behavior);
            if (columnId) localState.columns.add(columnId);
        }
    }
};
