import {
    Column,
    Content,
    DocumentInstanceState,
} from 'src/stores/document/document-type';
import { VerticalDirection } from 'src/stores/document/document-reducer';
import { findAdjacentSiblingNode } from 'src/stores/document/reducers/structure/move-node/helpers/find-adjacent-sibling-node';
import { deleteNodeById } from 'src/stores/document/reducers/structure/delete-node/helpers/delete-node-by-id';
import { cleanAndSortColumns } from 'src/stores/document/reducers/state/shared/clean-and-sort-columns';
import { updateActiveNode } from 'src/stores/document/reducers/state/shared/update-active-node';
import { moveChildGroups } from 'src/stores/document/reducers/structure/move-node/helpers/move-child-groups/move-child-groups';

export type MergeNodeAction = {
    type: 'MERGE_NODE';
    payload: {
        direction: VerticalDirection;
    };
};
export const mergeNode = (
    columns: Column[],
    content: Content,
    state: DocumentInstanceState,
    action: MergeNodeAction,
) => {
    const mergedNode = state.activeBranch.node;
    const adjacentNode = findAdjacentSiblingNode(
        columns,
        mergedNode,
        action.payload.direction,
    );
    if (mergedNode && adjacentNode) {
        const mergedNodeContent = content[mergedNode] || { content: '' };
        const adjacentNodeContent = content[adjacentNode] || { content: '' };
        deleteNodeById(columns, content, mergedNode);
        let newContent = '';
        if (action.payload.direction === 'up') {
            newContent = (
                adjacentNodeContent.content +
                ' ' +
                mergedNodeContent.content
            ).trim();
        } else if (action.payload.direction === 'down') {
            newContent = (
                mergedNodeContent.content +
                ' ' +
                adjacentNodeContent.content
            ).trim();
        }
        if (newContent) {
            const adjacentNodeContentObject = content[adjacentNode];
            if (adjacentNodeContentObject) {
                adjacentNodeContentObject.content = newContent;
            } else {
                content[adjacentNode] = { content: newContent };
            }
        }
        moveChildGroups(columns, {
            type: 'MERGE_PARENT',
            payload: {
                currentParent: mergedNode,
                newParent: adjacentNode,
                direction: action.payload.direction,
            },
        });
        cleanAndSortColumns(columns);
        updateActiveNode(columns, state, adjacentNode);
    }
};
