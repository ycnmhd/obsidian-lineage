import { insertNode } from 'src/stores/document/reducers/insert-node/insert-node';
import { LineageDocument } from 'src/stores/document/document-state-type';
import { pastChildGroups } from 'src/stores/document/reducers/clipboard/paste-node/helpers/past-child-groups';
import { cleanAndSortColumns } from 'src/lib/tree-utils/sort/clean-and-sort-columns';
import { textToBranches } from 'src/stores/document/reducers/clipboard/paste-node/helpers/text-to-branches';
import invariant from 'tiny-invariant';
import { Direction } from 'src/stores/document/document-store-actions';

export type PasteNodeAction = {
    type: 'DOCUMENT/PASTE_NODE';
    payload: {
        targetNodeId: string;
        text: string;
        position?: Direction;
    };
};

export const pasteNode = (
    document: LineageDocument,
    action: Pick<PasteNodeAction, 'payload'>,
) => {
    const branches = textToBranches(action.payload.text);
    const nextNode = branches[branches.length - 1].nodeId;
    const targetNode = action.payload.targetNodeId;
    const position = action.payload.position || 'down';
    // branches are reversed to allow using a const targetNodeId argument
    for (const branch of branches.reverse()) {
        insertNode(
            document,
            {
                payload: {
                    activeNodeId: targetNode,
                    position: position,
                    content: branch.content[branch.nodeId]?.content,
                },
            },
            branch.nodeId,
        );
        pastChildGroups(document, branch);
    }
    cleanAndSortColumns(document);
    invariant(nextNode);
    return nextNode;
};
