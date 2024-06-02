import {
    ClipboardBranch,
    LineageDocument,
} from 'src/stores/document/document-state-type';
import { findNodeColumn } from 'src/lib/tree-utils/find/find-node-column';
import { id } from 'src/helpers/id';

export const pastChildGroups = (
    document: LineageDocument,
    branch: ClipboardBranch,
) => {
    const parentColumnIndex = findNodeColumn(document.columns, branch.nodeId);
    if (parentColumnIndex === -1) throw new Error('could not find cut node');

    for (let i = 0; i < branch.sortedChildGroups.length; i++) {
        const groups = branch.sortedChildGroups[i];

        for (const group of groups) {
            const targetColumnIndex = parentColumnIndex + 1 + i;
            if (!document.columns[targetColumnIndex]) {
                document.columns.push({
                    id: id.column(),
                    groups: [],
                });
                document.columns = [...document.columns];
            }

            for (const node of group.nodes) {
                if (node in branch.content) {
                    document.content[node] = branch.content[node];
                }
            }
            document.columns[targetColumnIndex].groups.push(group);
            document.columns[targetColumnIndex].groups = [
                ...document.columns[targetColumnIndex].groups,
            ];
        }
    }
};
