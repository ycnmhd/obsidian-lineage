import { findNextActiveNode } from 'src/stores/view/reducers/document/state/helpers/find-next-node/find-next-active-node';
import { cleanAndSortColumns } from 'src/stores/view/reducers/document/state/helpers/clean-and-sort-columns';
import { updateActiveNode } from 'src/stores/view/reducers/document/state/helpers/update-active-node';
import {
    Column,
    Content,
    DocumentInstanceState,
} from 'src/stores/view/view-state-type';
import { deleteBranch } from 'src/stores/view/reducers/document/structure/delete-node/helpers/delete-branch';
import { isLastRootNode } from 'src/stores/view/reducers/document/structure/delete-node/helpers/is-last-root-node';

export type DeleteNodeAction = {
    type: 'DOCUMENT/DELETE_NODE';
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
    const lastNode = isLastRootNode(columns, activeNodeId);
    if (lastNode) return;

    const nextNode = findNextActiveNode(
        columns,
        state.activeBranch.node,
        action,
    );
    if (nextNode) {
        deleteBranch(columns, content, activeNodeId);
        cleanAndSortColumns(columns);
        updateActiveNode(columns, state, nextNode);
        return true;
    }
};
