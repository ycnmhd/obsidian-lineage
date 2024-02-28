import { moveNode } from 'src/stores/document/reducers/move-node/move-node';
import { describe, expect, it } from 'vitest';
import { Columns } from 'src/stores/document/document-reducer';
import { createNode } from 'src/stores/document/helpers/create-node';
import {
    __column__,
    __populateColumn__,
} from 'src/stores/document/reducers/move-node/helpers/test-helpers';

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
        const column1 = __column__(rootId);
        const droppedNode = createNode('root');
        const parentOfTargetNode = createNode('root');
        __populateColumn__(column1, droppedNode, parentOfTargetNode);

        const column2 = __column__(droppedNode.id, parentOfTargetNode.id);
        const childNode = createNode(droppedNode.id);
        const targetNode = createNode(parentOfTargetNode.id);
        __populateColumn__(column2, childNode, targetNode);

        const column3 = __column__(childNode.id);
        const grandChildNode = createNode(childNode.id);
        __populateColumn__(column3, grandChildNode);

        const columns = JSON.parse(
            JSON.stringify([column1, column2, column3]),
        ) as Columns;
        moveNode(columns, {
            type: 'DROP_NODE',
            payload: {
                droppedNodeId: droppedNode.id,
                targetNodeId: targetNode.id,
                position: 'right',
            },
        });
        expect(columns.length).toBe(5);
        for (const column of columns) {
            expect(column.groups.length).toBe(1);
        }
        expect(columns[0].groups[0].nodes[0].id === parentOfTargetNode.id);
        expect(columns[1].groups[0].nodes[0].id === targetNode.id);
        expect(columns[2].groups[0].nodes[0].id === droppedNode.id);
        expect(columns[3].groups[0].nodes[0].id === childNode.id);
        expect(columns[4].groups[0].nodes[0].id === grandChildNode.id);
    });
    it('dnd bug 24-02-26', () => {
        const droppedNodeId = 'n-lt33tfw9';
        const targetNodeId = 'n-lt33tfwi';
        const action = {
            type: 'DROP_NODE',
            payload: {
                droppedNodeId: droppedNodeId,
                targetNodeId: targetNodeId,
                position: 'bottom',
            },
        } as const;
        const content = '';
        const columns = [
            {
                id: 'c-lt33tfwa',
                groups: [
                    {
                        nodes: [
                            {
                                id: droppedNodeId,
                                content: content,
                                parentId: 'r-lt33tfw8',
                            },
                            {
                                id: targetNodeId,
                                content: content,
                                parentId: 'r-lt33tfw8',
                            },
                        ],
                        id: 'g-lt33tfwb',
                        parentId: 'r-lt33tfw8',
                    },
                ],
            },
            {
                id: 'c-lt33tfwd',
                groups: [
                    {
                        nodes: [
                            {
                                id: 'n-lt33tfwc',
                                content: content,
                                parentId: droppedNodeId,
                            },
                        ],
                        id: 'g-lt33tfwe',
                        parentId: droppedNodeId,
                    },
                    {
                        nodes: [
                            {
                                id: 'n-lt33tfwj',
                                content: content,
                                parentId: targetNodeId,
                            },
                        ],
                        id: 'g-lt33tfwk',
                        parentId: targetNodeId,
                    },
                ],
            },
            {
                id: 'c-lt33tfwg',
                groups: [
                    {
                        nodes: [
                            {
                                id: 'n-lt33tfwf',
                                content: content,
                                parentId: 'n-lt33tfwc',
                            },
                        ],
                        id: 'g-lt33tfwh',
                        parentId: 'n-lt33tfwc',
                    },
                ],
            },
        ];

        const output = [
            {
                id: 'c-lt33tfwa',
                groups: [
                    {
                        nodes: [
                            {
                                id: targetNodeId,
                                content: content,
                                parentId: 'r-lt33tfw8',
                            },
                            {
                                id: droppedNodeId,
                                content: content,
                                parentId: 'r-lt33tfw8',
                            },
                        ],
                        id: 'g-lt33tfwb',
                        parentId: 'r-lt33tfw8',
                    },
                ],
            },
            {
                id: 'c-lt33tfwd',
                groups: [
                    {
                        nodes: [
                            {
                                id: 'n-lt33tfwj',
                                content: content,
                                parentId: targetNodeId,
                            },
                        ],
                        id: 'g-lt33tfwk',
                        parentId: targetNodeId,
                    },
                    {
                        nodes: [
                            {
                                id: 'n-lt33tfwc',
                                content: content,
                                parentId: droppedNodeId,
                            },
                        ],
                        id: 'g-lt33tfwe',
                        parentId: droppedNodeId,
                    },
                ],
            },
            {
                id: 'c-lt33tfwg',
                groups: [
                    {
                        nodes: [
                            {
                                id: 'n-lt33tfwf',
                                content: content,
                                parentId: 'n-lt33tfwc',
                            },
                        ],
                        id: 'g-lt33tfwh',
                        parentId: 'n-lt33tfwc',
                    },
                ],
            },
        ];
        moveNode(columns, action);
        expect(columns).toEqual(output);
    });
});
