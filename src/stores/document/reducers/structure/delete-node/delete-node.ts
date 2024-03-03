import { findNextActiveNode } from 'src/stores/document/reducers/state/shared/find-next-node/find-next-active-node';
import { cleanAndSortColumns } from 'src/stores/document/reducers/state/shared/clean-and-sort-columns';
import { updateActiveNode } from 'src/stores/document/reducers/state/shared/update-active-node';
import {
    Column,
    Content,
    DocumentInstanceState,
} from 'src/stores/document/document-type';
import { isLastRootNode } from 'src/stores/document/reducers/structure/delete-node/helpers/is-last-root-node';
import { deleteBranch } from 'src/stores/document/reducers/structure/delete-node/helpers/delete-branch';

export type DeleteNodeAction = {
    type: 'TREE/DELETE_NODE';
};

export const deleteNode = (
    columns: Column[],
    state: DocumentInstanceState,
    content: Content,
    action: DeleteNodeAction,
) => {
    const activeNodeId = state.activeBranch.node;
    if (!activeNodeId) return;
    if (activeNodeId === state.editing.activeNodeId) return;
    if (isLastRootNode(columns, activeNodeId)) return;

    const nextNode = findNextActiveNode(columns, state, action);
    if (nextNode) {
        deleteBranch(columns, content, activeNodeId);
        cleanAndSortColumns(columns);
        updateActiveNode(columns, state, nextNode);
    }
};
