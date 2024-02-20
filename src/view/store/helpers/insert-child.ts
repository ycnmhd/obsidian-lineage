import { findNodeColumn } from './find-node-column';
import { createNode } from './create-node';
import { sortGroups } from './sort-groups';
import { Matrix } from '../document.store';
import { id } from 'src/helpers/id';

export const insertChild = (
    matrix: Matrix,
    nodeId: string,
    parentId: string,
    __newNodeID__?: string,
) => {
    const parentColumnIndex = findNodeColumn(matrix, parentId);
    let createdNodeId: string | null = null;
    if (parentColumnIndex !== -1) {
        const childColumnIndex = parentColumnIndex + 1;
        const createdNode = createNode(nodeId, __newNodeID__);
        createdNodeId = createdNode.id;
        if (matrix[childColumnIndex]) {
            const childColumn = matrix[childColumnIndex];
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
                matrix[parentColumnIndex].groups,
                childColumn.groups,
            );
        } else {
            matrix.push({
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
