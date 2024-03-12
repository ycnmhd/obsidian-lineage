import { ViewState } from 'src/stores/view/view-state-type';
import { AlignBranchState } from 'src/stores/view/effects/view/align-branch-effect/helpers/align-branch/helpers/align-element';
import { alignParentsAndActiveNode } from 'src/stores/view/effects/view/align-branch-effect/helpers/align-branch/align-parents-and-active-node';
import { alignChildGroup } from 'src/stores/view/effects/view/align-branch-effect/helpers/align-branch/align-child-group';
import { alignInactiveColumn } from 'src/stores/view/effects/view/align-branch-effect/helpers/align-branch/align-inactive-column';

export const alignBranch = (
    state: ViewState,
    container: HTMLElement,
    behavior?: ScrollBehavior,
) => {
    if (!container) return;
    const nodeId = state.document.state.activeNode;
    if (!nodeId) return;
    const localState: AlignBranchState = {
        columns: new Set<string>(),
    };
    alignParentsAndActiveNode(state, container, localState, behavior);

    for (const column of state.document.columns) {
        if (localState.columns.has(column.id)) continue;

        const childGroups = column.groups.filter((g) =>
            state.ui.state.activeBranch.childGroups.has(g.parentId),
        );
        if (childGroups.length > 0) {
            alignChildGroup(state, container, childGroups, column.id, behavior);
        } else {
            alignInactiveColumn(column, container, behavior);
        }
    }
};
