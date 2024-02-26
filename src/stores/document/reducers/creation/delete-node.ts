import { Column, DocumentState } from 'src/stores/document/document-reducer';
import { findNode } from 'src/stores/document/helpers/find-node';
import { traverseDown } from 'src/stores/document/helpers/find-branch';
import { updateActiveNode } from 'src/stores/document/helpers/update-active-node';
import { findNextActiveNode } from 'src/stores/document/reducers/creation/helpers/find-next-active-node';

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

export type DeleteNodeAction = {
    type: 'TREE/DELETE_NODE';
};

export const deleteNode = (state: DocumentState) => {
    const node = findNode(state.columns, state.state.activeBranch.node);
    if (node) {
        const nextNode = findNextActiveNode(state.columns, node);
        const childGroups = new Set<string>();
        traverseDown(childGroups, new Set<string>(), state.columns, node);
        if (childGroups.size > 0) deleteGroupsById(state.columns, childGroups);
        deleteNodeById(state.columns, node.id);

        updateActiveNode(state, nextNode?.id);
    }
};
