import { Column, NodeId, TreeState } from 'src/stores/view/view-state-type';
import { traverseUp } from 'src/stores/view/helpers/search/traverse-up';
import { traverseDown } from 'src/stores/view/helpers/search/traverse-down';
import { findGroupByNodeId } from 'src/stores/view/helpers/search/find-group-by-node-id';
import { updateEditingNodeOnActiveNodeChange } from 'src/stores/view/reducers/document/state/update-editing-node-on-active-node-change';

export const updateTreeState = (
    columns: Column[],
    state: TreeState,
    activeNodeId: string,
    newNode = false,
) => {
    const node = activeNodeId;
    if (node) {
        updateEditingNodeOnActiveNodeChange(state, node, newNode);
        const sortedParents = traverseUp(columns, node);
        const childGroups: NodeId[] = [];
        traverseDown(childGroups, columns, node);
        const group = findGroupByNodeId(columns, node);
        if (!group) throw new Error('could not find group for node ' + node);
        state.activeBranch = {
            childGroups: new Set<string>(childGroups),
            sortedParentNodes: sortedParents.reverse(),
            group: group.parentId,
        };
    } else {
        state.activeBranch = {
            group: '',
            childGroups: new Set<string>(),
            sortedParentNodes: [],
        };
    }
};
