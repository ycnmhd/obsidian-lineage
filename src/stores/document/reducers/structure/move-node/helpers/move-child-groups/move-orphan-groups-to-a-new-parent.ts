import { Columns, NodeGroup, NodeId } from 'src/stores/document/document-type';
import { findNodeColumn } from 'src/stores/document/helpers/find-node-column';
import { id } from 'src/helpers/id';
import { traverseDown } from 'src/stores/document/helpers/search/traverse-down';
import { VerticalDirection } from 'src/stores/document/document-reducer';

export const moveOrphanGroupsToANewParent = (
    columns: Columns,
    newParentNode: NodeId,
    sortedChildGroups: NodeGroup[],
    direction: VerticalDirection,
) => {
    // insert child groups into their new columns
    const sortedGroupsOfNewParent: NodeId[] = [];
    traverseDown(sortedGroupsOfNewParent, new Set(), columns, newParentNode);
    const parentColumnIndex = findNodeColumn(columns, newParentNode);
    for (let i = 0; i < sortedChildGroups.length; i++) {
        const orphanGroup = sortedChildGroups[i];

        const targetColumnIndex = parentColumnIndex + 1 + i;
        const existingGroupId = sortedGroupsOfNewParent[i];
        if (existingGroupId) {
            const existingGroup = columns[targetColumnIndex].groups.find(
                (g) => g.parentId === existingGroupId,
            );
            if (!existingGroup)
                throw new Error(
                    `could not find group ${existingGroupId} of new parent ${newParentNode}`,
                );
            if (direction === 'up')
                existingGroup.nodes.push(...orphanGroup.nodes);
            else {
                existingGroup.nodes = [
                    ...orphanGroup.nodes,
                    ...existingGroup.nodes,
                ];
            }
        } else {
            if (!columns[targetColumnIndex]) {
                columns.push({
                    id: id.column(),
                    groups: [],
                });
            }
            if (i === 0) {
                orphanGroup.parentId = newParentNode;
            }
            columns[targetColumnIndex].groups.push(orphanGroup);
        }
    }
};
