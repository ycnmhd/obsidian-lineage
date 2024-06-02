import { cleanAndSortColumns } from 'src/lib/tree-utils/sort/clean-and-sort-columns';
import { LineageDocument } from 'src/stores/document/document-state-type';
import { deleteChildNodes } from 'src/lib/tree-utils/delete/delete-child-nodes';
import { isLastRootNode } from 'src/lib/tree-utils/assert/is-last-root-node';
import invariant from 'tiny-invariant';
import { findNextActiveNode } from 'src/lib/tree-utils/find/find-next-active-node';
import { deleteNodeById } from 'src/lib/tree-utils/delete/delete-node-by-id';
import { lang } from 'src/lang/lang';

export type DeleteNodeAction = {
    type: 'DOCUMENT/DELETE_NODE';
    payload: {
        activeNodeId: string;
    };
};

export const deleteNode = (document: LineageDocument, nodeId: string) => {
    invariant(nodeId);

    const lastNode = isLastRootNode(document.columns, nodeId);
    if (lastNode) throw new Error(lang.error_delete_last_node);

    const nextNode = findNextActiveNode(document.columns, nodeId, {
        type: 'DOCUMENT/DELETE_NODE',
        payload: {
            activeNodeId: nodeId,
        },
    });
    invariant(nextNode);
    deleteChildNodes(document, nodeId);
    deleteNodeById(document.columns, document.content, nodeId);
    cleanAndSortColumns(document);
    return nextNode;
};
