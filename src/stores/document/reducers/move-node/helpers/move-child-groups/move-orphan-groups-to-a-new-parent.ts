import { Columns, NodeId } from 'src/stores/document/document-state-type';
import { findNodeColumn } from 'src/stores/view/helpers/find-node-column';
import { id } from 'src/helpers/id';
import { VerticalDirection } from 'src/stores/document/document-store-actions';
import { findGroupByParentId } from 'src/stores/view/helpers/search/find-group-by-node-id';

export const moveOrphanGroupsToANewParent = (
    columns: Columns,
    currentParentNode: NodeId,
    newParentNode: NodeId,
    direction: VerticalDirection,
) => {
    const groupOfMergedNode = findGroupByParentId(columns, currentParentNode);
    if (!groupOfMergedNode) return;
    // remove from current column
    groupOfMergedNode.column.groups = groupOfMergedNode.column.groups.filter(
        (g) => g.parentId !== groupOfMergedNode.group.parentId,
    );
    // insert child groups into their new columns
    const parentColumnIndex = findNodeColumn(columns, newParentNode);

    const targetColumnIndex = parentColumnIndex + 1;
    const existingGroupOfNewParent = findGroupByParentId(
        columns,
        newParentNode,
    );

    if (existingGroupOfNewParent) {
        if (direction === 'up')
            existingGroupOfNewParent.group.nodes.push(
                ...groupOfMergedNode.group.nodes,
            );
        else {
            existingGroupOfNewParent.group.nodes = [
                ...groupOfMergedNode.group.nodes,
                ...existingGroupOfNewParent.group.nodes,
            ];
        }
    } else {
        if (!columns[targetColumnIndex]) {
            columns.push({
                id: id.column(),
                groups: [],
            });
        }
        groupOfMergedNode.group.parentId = newParentNode;
        columns[targetColumnIndex].groups.push(groupOfMergedNode.group);
    }
};
