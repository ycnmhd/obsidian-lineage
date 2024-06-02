import { LineageDocument } from 'src/stores/document/document-state-type';
import invariant from 'tiny-invariant';
import { deleteChildNodes } from 'src/lib/tree-utils/delete/delete-child-nodes';
import { setNodeContent } from 'src/stores/document/reducers/content/set-node-content';
import { cleanAndSortColumns } from 'src/lib/tree-utils/sort/clean-and-sort-columns';

export type ExtractNodeAction = {
    type: 'DOCUMENT/EXTRACT_BRANCH';
    payload: {
        nodeId: string;
        documentName: string;
    };
};
export const extractNode = (
    document: LineageDocument,
    action: Pick<ExtractNodeAction, 'payload'>,
) => {
    invariant(action.payload.nodeId);
    invariant(action.payload.documentName);
    deleteChildNodes(document, action.payload.nodeId);
    cleanAndSortColumns(document);
    setNodeContent(document.content, {
        payload: {
            nodeId: action.payload.nodeId,
            content: `[[${action.payload.documentName}]]`,
        },
    });
};
