import { findNodeColumn } from './find-node-column';
import { createNode } from './create-node';
import { sortGroups } from './sort-groups';
import { Columns } from '../document-reducer';
import { id } from 'src/helpers/id';

export const insertChild = (
    columns: Columns,
    nodeId: string,
    parentId: string,
    __newNodeID__?: string,
) => {
    const parentColumnIndex = findNodeColumn(columns, parentId);
    let createdNodeId: string | null = null;
    if (parentColumnIndex !== -1) {
        const childColumnIndex = parentColumnIndex + 1;
        const createdNode = createNode(nodeId, __newNodeID__);
        createdNodeId = createdNode.id;
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
    return createdNodeId;
};
