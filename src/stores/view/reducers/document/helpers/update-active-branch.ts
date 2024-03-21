import { Column, NodeId } from 'src/stores/document/document-state-type';
import { traverseUp } from 'src/stores/view/helpers/search/traverse-up';
import { traverseDown } from 'src/stores/view/helpers/search/traverse-down';
import { findGroupByNodeId } from 'src/stores/view/helpers/search/find-group-by-node-id';
import { findNodeColumn } from 'src/stores/view/helpers/find-node-column';
import { ActiveBranch } from 'src/stores/view/default-view-state';

export type UpdateActiveBranchAction = {
    type: 'UPDATE_ACTIVE_BRANCH';
    payload: {
        columns: Column[];
    };
};

export const updateActiveBranch = (
    activeBranch: ActiveBranch,
    activeNodeId: string,
    columns: Column[],
) => {
    if (!activeNodeId) return;
    const sortedParents = traverseUp(columns, activeNodeId);
    const childGroups: NodeId[] = [];
    traverseDown(childGroups, columns, activeNodeId);
    const group = findGroupByNodeId(columns, activeNodeId);
    if (!group)
        throw new Error('could not find group for node ' + activeNodeId);
    activeBranch.childGroups = new Set<string>(childGroups);
    activeBranch.sortedParentNodes = sortedParents.reverse();
    activeBranch.group = group.parentId;
    activeBranch.column = columns[findNodeColumn(columns, activeNodeId)].id;
};
