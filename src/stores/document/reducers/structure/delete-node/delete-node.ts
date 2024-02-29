import { Column, DocumentState } from 'src/stores/document/document-reducer';
import { findNode } from 'src/stores/document/helpers/find-node';
import { traverseDown } from 'src/stores/document/helpers/find-branch';
import { findNextActiveNode } from 'src/stores/document/reducers/structure/delete-node/helpers/find-next-active-node';
import { cleanAndSortColumns } from 'src/stores/document/reducers/state/helpers/clean-and-sort-columns';
import { updateActiveNode } from 'src/stores/document/reducers/state/update-active-node';

const deleteGroupsById = (columns: Column[], groupIds: Set<string>): void => {
    for (const column of columns) {
        column.groups = column.groups.filter(
            (group) =>
                !(!group.parentId.startsWith('r-') && groupIds.has(group.id)),
        );
    }
};

const deleteNodeById = (columns: Column[], nodeId: string): void => {
    for (const column of columns) {
        for (const group of column.groups) {
            group.nodes = group.nodes.filter((node) => node.id !== nodeId);
        }
    }
};

export const isLastNode = (columns: Column[]): boolean => {
    if (columns.length === 1) {
        const column = columns[0];

        if (column.groups.length === 1) {
            const group = column.groups[0];

            if (group.nodes.length === 1) return true;
        }
    }
    return false;
};

export type DeleteNodeAction = {
    type: 'TREE/DELETE_NODE';
};

export const deleteNode = (state: DocumentState) => {
    if (state.state.activeBranch.node === state.state.editing.activeNodeId)
        return;
    const node = findNode(state.columns, state.state.activeBranch.node);
    if (node) {
        if (isLastNode(state.columns)) return;
        const nextNode = findNextActiveNode(state.columns, node);
        const childGroups = new Set<string>();
        traverseDown(childGroups, new Set<string>(), state.columns, node);
        if (childGroups.size > 0) deleteGroupsById(state.columns, childGroups);
        deleteNodeById(state.columns, node.id);
        cleanAndSortColumns(state);
        if (nextNode) updateActiveNode(state, nextNode.id);
    }
};
