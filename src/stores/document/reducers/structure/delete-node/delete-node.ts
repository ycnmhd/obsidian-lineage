import { findNextActiveNode } from 'src/stores/document/reducers/structure/delete-node/helpers/find-next-active-node';
import { cleanAndSortColumns } from 'src/stores/document/reducers/state/helpers/clean-and-sort-columns';
import { updateActiveNode } from 'src/stores/document/reducers/state/update-active-node';
import { traverseDown } from 'src/stores/document/helpers/search/traverse-down';
import {
    Column,
    ColumnNode,
    DocumentInstance,
} from 'src/stores/document/document-type';
import { deleteGroupsByParentId } from 'src/stores/document/reducers/structure/delete-node/delete-groups-by-parent-id';

const deleteNodeById = (document: DocumentInstance, nodeId: string): void => {
    for (const column of document.document.columns) {
        for (const group of column.groups) {
            for (let i = 0; i < group.nodes.length; i++) {
                const _nodeId = group.nodes[i];
                if (_nodeId === nodeId) {
                    group.nodes.splice(i, 1);
                    delete document.document.content[_nodeId];
                    return;
                }
            }
        }
    }
};

export const isLastRootNode = (
    columns: Column[],
    node: ColumnNode,
): boolean => {
    const column = columns[0];

    if (column.groups.length === 1) {
        const group = column.groups[0];

        if (group.nodes.length === 1 && group.nodes[0] === node) return true;
    }
    return false;
};

export type DeleteNodeAction = {
    type: 'TREE/DELETE_NODE';
};

export const deleteNode = (state: DocumentInstance) => {
    const node = state.state.activeBranch.node;
    if (node) {
        if (node === state.state.editing.activeNodeId) return;
        if (isLastRootNode(state.document.columns, node)) return;
        const nextNode = findNextActiveNode(state.document.columns, node);
        const childGroups = new Set<string>();
        traverseDown(
            childGroups,
            new Set<string>(),
            state.document.columns,
            node,
        );
        if (childGroups.size > 0)
            deleteGroupsByParentId(state.document, childGroups);
        deleteNodeById(state, node);
        cleanAndSortColumns(state.document);
        if (nextNode) updateActiveNode(state, nextNode);
    }
};
