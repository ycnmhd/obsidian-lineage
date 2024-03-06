import { Column, NodeId, TreeState } from 'src/stores/view/view-state-type';
import { traverseUp } from 'src/stores/view/helpers/search/traverse-up';
import { traverseDown } from 'src/stores/view/helpers/search/traverse-down';
import { findGroupByNodeId } from 'src/stores/view/helpers/search/find-group-by-node-id';
import { updateEditingNodeOnActiveNodeChange } from 'src/stores/view/reducers/document/state/update-editing-node-on-active-node-change';
import { findNodeColumn } from 'src/stores/view/helpers/find-node-column';

export const updateTreeState = (
    columns: Column[],
    state: TreeState,
    activeNodeId: string,
    newNode = false,
) => {
    if (activeNodeId) {
        updateEditingNodeOnActiveNodeChange(state, activeNodeId, newNode);
        const sortedParents = traverseUp(columns, activeNodeId);
        const childGroups: NodeId[] = [];
        traverseDown(childGroups, columns, activeNodeId);
        const group = findGroupByNodeId(columns, activeNodeId);
        if (!group)
            throw new Error('could not find group for node ' + activeNodeId);
        state.activeBranch = {
            childGroups: new Set<string>(childGroups),
            sortedParentNodes: sortedParents.reverse(),
            group: group.parentId,
            column: columns[findNodeColumn(columns, activeNodeId)].id,
        };
    } else {
        state.activeBranch = {
            group: '',
            childGroups: new Set<string>(),
            sortedParentNodes: [],
            column: '',
        };
    }
};
