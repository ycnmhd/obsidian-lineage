import {
    LineageDocument,
    NodeId,
} from 'src/stores/document/document-state-type';
import { findNodeColumn } from 'src/lib/tree-utils/find/find-node-column';
import { id } from 'src/helpers/id';
import { getSortedChildGroups } from 'src/lib/tree-utils/get/get-sorted-child-groups';

export const moveChildGroupsNextToTheirParent = (
    document: Pick<LineageDocument, 'columns'>,
    parentNode: NodeId,
) => {
    const sortedChildGroups = getSortedChildGroups(
        document.columns,
        parentNode,
        true,
    );
    // insert child groups into their new columns
    const parentColumnIndex = findNodeColumn(document.columns, parentNode);
    for (let i = 0; i < sortedChildGroups.length; i++) {
        const groups = sortedChildGroups[i];

        for (const group of groups) {
            const targetColumnIndex = parentColumnIndex + 1 + i;
            if (!document.columns[targetColumnIndex]) {
                document.columns.push({
                    id: id.column(),
                    groups: [],
                });
                document.columns = [...document.columns];
            }

            document.columns[targetColumnIndex].groups.push(group);
            document.columns[targetColumnIndex].groups = [
                ...document.columns[targetColumnIndex].groups,
            ];
        }
    }
};
