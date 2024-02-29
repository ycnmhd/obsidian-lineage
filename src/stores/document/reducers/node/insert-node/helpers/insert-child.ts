import { findNodeColumn } from '../../../../helpers/find-node-column';
import { createNode } from '../../../../helpers/create-node';
import { ColumnNode, Columns } from '../../../../document-reducer';
import { id } from 'src/helpers/id';
import { sortGroups } from 'src/stores/document/reducers/state/helpers/sort-groups';

export const insertChild = (
    columns: Columns,
    nodeId: string,
    parentId: string,
    __newNodeID__?: string,
) => {
    const parentColumnIndex = findNodeColumn(columns, parentId);
    let createdNode: ColumnNode | null = null;
    if (parentColumnIndex !== -1) {
        const childColumnIndex = parentColumnIndex + 1;
        createdNode = createNode(nodeId, __newNodeID__);

        if (columns[childColumnIndex]) {
            const childColumn = columns[childColumnIndex];
            const childGroup = childColumn.groups.find(
                (g) => g.parentId === nodeId,
            );
            if (childGroup) {
                childGroup.nodes.push(createdNode);
            } else {
                childColumn.groups.push({
                    nodes: [createdNode],
                    parentId: nodeId,
                    id: id.group(),
                });
            }
            childColumn.groups = sortGroups(
                columns[parentColumnIndex].groups,
                childColumn.groups,
            );
        } else {
            columns.push({
                id: id.column(),
                groups: [
                    {
                        nodes: [createdNode],
                        parentId: nodeId,
                        id: id.group(),
                    },
                ],
            });
        }
    }
    return createdNode;
};
