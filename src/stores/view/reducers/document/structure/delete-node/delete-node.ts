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
    editingNode?: string,
) => {
    const activeNodeId = state.activeNode;
    if (!activeNodeId) throw new Error('no active node');
    if (editingNode && activeNodeId !== editingNode)
        throw new Error('active node is not in edit mode');
    const lastNode = isLastRootNode(columns, activeNodeId);
    if (lastNode) throw new Error('cannot delete last node');

    const nextNode = findNextActiveNode(columns, state.activeNode, {
        type: 'DOCUMENT/DELETE_NODE',
    });
    if (!nextNode) throw new Error('could not find next node');
    if (nextNode) {
        deleteBranch(columns, content, activeNodeId);
        cleanAndSortColumns(columns);
        updateActiveNode(state, nextNode);
        return true;
    }
};
