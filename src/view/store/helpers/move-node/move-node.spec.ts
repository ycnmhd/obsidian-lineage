import { moveNode } from 'src/view/store/helpers/move-node/move-node';
import { describe, expect, it } from 'vitest';
import {
    Column,
    Matrix,
    MatrixNode,
    NodeGroup,
} from 'src/view/store/document-reducer';
import { id } from 'src/helpers/id';
import { createNode } from 'src/view/store/helpers/create-node';

const createGroup = (parentId: string, __id__?: string): NodeGroup => ({
    id: __id__ || id.group(),
    parentId,
    nodes: [],
});
const createColumn = (...parentIds: string[]): Column => ({
    id: id.column(),
    groups: parentIds ? parentIds.map((parentId) => createGroup(parentId)) : [],
});
const insertNodes = (
    column: Column,
    groupIndex: number,
    ...nodes: MatrixNode[]
) => {
    column.groups[groupIndex].nodes.push(...nodes);
};

describe('move-node', () => {
    it('case 1', () => {
        // input
        // --                 --           --
        // droppedNode        [childNode]  [grandChildNode]
        //                    --           --
        // parentOfTargetNode [targetNode]
        // --                 --

        // output
        // --                 --           --
        // parentOfTargetNode [targetNode] droppedNode        [childNode]  [grandChildNode]
        // --                 --           --
        const rootId = 'root';
        const column1 = createColumn(rootId);
        const droppedNode = createNode('root');
        const parentOfTargetNode = createNode('root');
        insertNodes(column1, 0, droppedNode, parentOfTargetNode);

        const column2 = createColumn(droppedNode.id, parentOfTargetNode.id);
        const childNode = createNode(droppedNode.id);
        const targetNode = createNode(parentOfTargetNode.id);
        insertNodes(column2, 0, childNode);
        insertNodes(column2, 1, targetNode);

        const column3 = createColumn(childNode.id);
        const grandChildNode = createNode(childNode.id);
        insertNodes(column3, 0, grandChildNode);

        const matrix = JSON.parse(
            JSON.stringify([column1, column2, column3]),
        ) as Matrix;
        moveNode(matrix, {
            type: 'DROP_NODE',
            payload: {
                droppedNodeId: droppedNode.id,
                targetNodeId: targetNode.id,
                position: 'right',
            },
        });
        expect(matrix.length).toBe(5);
        for (const column of matrix) {
            expect(column.groups.length).toBe(1);
        }
        expect(matrix[0].groups[0].nodes[0].id === parentOfTargetNode.id);
        expect(matrix[1].groups[0].nodes[0].id === targetNode.id);
        expect(matrix[2].groups[0].nodes[0].id === droppedNode.id);
        expect(matrix[3].groups[0].nodes[0].id === childNode.id);
        expect(matrix[4].groups[0].nodes[0].id === grandChildNode.id);
    });
});
