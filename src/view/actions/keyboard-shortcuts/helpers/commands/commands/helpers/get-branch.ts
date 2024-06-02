import { getSortedChildGroups } from 'src/lib/tree-utils/get/get-sorted-child-groups';
import {
    ClipboardBranch,
    Column,
    Content,
} from 'src/stores/document/document-state-type';
import { deleteNodeById } from 'src/lib/tree-utils/delete/delete-node-by-id';
import { clone } from 'src/helpers/clone';

export const getBranch = (
    columns: Column[],
    content: Content,
    nodeId: string,
    mode: 'cut' | 'copy',
) => {
    const cut = mode === 'cut';
    const sortedChildGroups = getSortedChildGroups(columns, nodeId, cut);

    const newContent: Content = {};
    for (const sortedChildGroup of sortedChildGroups) {
        for (const group of sortedChildGroup) {
            for (const node of group.nodes) {
                if (node in content) {
                    newContent[node] = content[node];
                    if (cut) delete content[node];
                }
            }
        }
    }
    newContent[nodeId] = content[nodeId];
    const branch: ClipboardBranch = {
        sortedChildGroups,
        content: newContent,
        nodeId: nodeId,
        mode: mode,
    };
    if (cut) deleteNodeById(columns, content, nodeId);
    return clone(branch);
};
