import { LineageDocument } from 'src/stores/document/document-state-type';
import { VerticalDirection } from 'src/stores/document/document-store-actions';
import { findAdjacentSiblingNode } from 'src/lib/tree-utils/find/find-adjacent-sibling-node';
import { deleteNodeById } from 'src/lib/tree-utils/delete/delete-node-by-id';
import { cleanAndSortColumns } from 'src/lib/tree-utils/sort/clean-and-sort-columns';
import { moveOrphanGroupsToANewParent } from 'src/lib/tree-utils/move/move-orphan-groups-to-a-new-parent';
import invariant from 'tiny-invariant';
import { SilentError } from 'src/lib/errors/errors';

export type MergeNodeAction = {
    type: 'DOCUMENT/MERGE_NODE';
    payload: {
        direction: VerticalDirection;
        activeNodeId: string;
    };
};
export const mergeNode = (
    document: LineageDocument,
    action: MergeNodeAction,
) => {
    const mergedNode = action.payload.activeNodeId;
    const adjacentNode = findAdjacentSiblingNode(
        document.columns,
        mergedNode,
        action.payload.direction,
    );
    invariant(mergedNode, 'merged node is undefined');
    if (!adjacentNode) throw new SilentError('could not find adjacent node');
    const mergedNodeContent = document.content[mergedNode] || { content: '' };
    const adjacentNodeContent = document.content[adjacentNode] || {
        content: '',
    };

    let newContent = '';
    if (action.payload.direction === 'up') {
        newContent = (
            adjacentNodeContent.content +
            '\n' +
            mergedNodeContent.content
        ).trim();
    } else if (action.payload.direction === 'down') {
        newContent = (
            mergedNodeContent.content +
            '\n' +
            adjacentNodeContent.content
        ).trim();
    }
    if (newContent) {
        const adjacentNodeContentObject = document.content[adjacentNode];
        if (adjacentNodeContentObject) {
            adjacentNodeContentObject.content = newContent;
        } else {
            document.content[adjacentNode] = { content: newContent };
        }
    }

    moveOrphanGroupsToANewParent(
        document,
        mergedNode,
        adjacentNode,
        action.payload.direction,
    );
    deleteNodeById(document.columns, document.content, mergedNode);
    cleanAndSortColumns(document);
    return adjacentNode;
};
