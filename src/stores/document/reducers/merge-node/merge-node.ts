import { Column, Content } from 'src/stores/document/document-state-type';
import { VerticalDirection } from 'src/stores/document/document-store-actions';
import { findAdjacentSiblingNode } from 'src/stores/document/reducers/move-node/helpers/find-adjacent-sibling-node';
import { deleteNodeById } from 'src/stores/document/reducers/delete-node/helpers/delete-node-by-id';
import { cleanAndSortColumns } from 'src/stores/document/reducers/move-node/helpers/clean-and-sort-columns';
import { moveOrphanGroupsToANewParent } from 'src/stores/document/reducers/move-node/helpers/move-child-groups/move-orphan-groups-to-a-new-parent';
import invariant from 'tiny-invariant';
import { SilentError } from 'src/stores/view/helpers/errors';

export type MergeNodeAction = {
    type: 'DOCUMENT/MERGE_NODE';
    payload: {
        direction: VerticalDirection;
        activeNodeId: string;
    };
};
export const mergeNode = (
    columns: Column[],
    content: Content,
    action: MergeNodeAction,
) => {
    const mergedNode = action.payload.activeNodeId;
    const adjacentNode = findAdjacentSiblingNode(
        columns,
        mergedNode,
        action.payload.direction,
    );
    invariant(mergedNode, 'merged node is undefined');
    if (!adjacentNode) throw new SilentError('could not find adjacent node');
    const mergedNodeContent = content[mergedNode] || { content: '' };
    const adjacentNodeContent = content[adjacentNode] || { content: '' };

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

    moveOrphanGroupsToANewParent(
        columns,
        mergedNode,
        adjacentNode,
        action.payload.direction,
    );
    deleteNodeById(columns, content, mergedNode);
    cleanAndSortColumns(columns);
    return adjacentNode;
};
