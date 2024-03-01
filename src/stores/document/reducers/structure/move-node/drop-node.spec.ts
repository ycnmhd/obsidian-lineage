import { dropNode } from 'src/stores/document/reducers/structure/move-node/drop-node';
import { describe, expect, it } from 'vitest';
import { Column } from 'src/stores/document/document-type';

describe('move-node', () => {
    it('dnd bug 24-02-26', () => {
        const droppedNodeId = 'n-lt33tfw9';
        const targetNodeId = 'n-lt33tfwi';
        const action = {
            type: 'DROP_NODE',
            payload: {
                droppedNodeId: droppedNodeId,
                targetNodeId: targetNodeId,
                position: 'down',
            },
        } as const;
        const columns: Column[] = [
            {
                id: 'c-lt33tfwa',
                groups: [
                    {
                        nodes: [droppedNodeId, targetNodeId],
                        parentId: 'r-lt33tfw8',
                    },
                ],
            },
            {
                id: 'c-lt33tfwd',
                groups: [
                    {
                        nodes: ['n-lt33tfwc'],
                        parentId: droppedNodeId,
                    },
                    {
                        nodes: ['n-lt33tfwj'],
                        parentId: targetNodeId,
                    },
                ],
            },
            {
                id: 'c-lt33tfwg',
                groups: [
                    {
                        nodes: ['n-lt33tfwf'],
                        parentId: 'n-lt33tfwc',
                    },
                ],
            },
        ];

        const output: Column[] = [
            {
                id: 'c-lt33tfwa',
                groups: [
                    {
                        nodes: [targetNodeId, droppedNodeId],
                        parentId: 'r-lt33tfw8',
                    },
                ],
            },
            {
                id: 'c-lt33tfwd',
                groups: [
                    {
                        nodes: ['n-lt33tfwj'],
                        parentId: targetNodeId,
                    },
                    {
                        nodes: ['n-lt33tfwc'],
                        parentId: droppedNodeId,
                    },
                ],
            },
            {
                id: 'c-lt33tfwg',
                groups: [
                    {
                        nodes: ['n-lt33tfwf'],
                        parentId: 'n-lt33tfwc',
                    },
                ],
            },
        ];
        const state = { columns };
        dropNode(state, action);
        expect(state.columns).toEqual(output);
    });

    it('case', () => {
        const state = {
            content: {
                'n-lt90nq7d': { content: '1' },
                'n-lt90nv74': { content: '1.1' },
                'n-lt90nwh2': { content: '1.1.1' },
                'n-lt90nyee': { content: '1.1.2' },
                'n-lt90o0j9': { content: '1.1.3' },
                'n-lt90o4xa': { content: '1.1.3.1' },
                'n-lt90o8fj': { content: '1.1.3.2' },
            },
            columns: [
                {
                    id: 'c-lt90nq7e',
                    groups: [{ nodes: ['n-lt90nq7d'], parentId: 'r-lt90nq7c' }],
                },
                {
                    id: 'c-lt90nv75',
                    groups: [{ nodes: ['n-lt90nv74'], parentId: 'n-lt90nq7d' }],
                },
                {
                    id: 'c-lt90nwh3',
                    groups: [
                        {
                            nodes: ['n-lt90nwh2', 'n-lt90nyee', 'n-lt90o0j9'],
                            parentId: 'n-lt90nv74',
                        },
                    ],
                },
                {
                    id: 'c-lt90o4xb',
                    groups: [
                        {
                            nodes: ['n-lt90o4xa', 'n-lt90o8fj'],
                            parentId: 'n-lt90o0j9',
                        },
                    ],
                },
            ],
        };
        const action = {
            type: 'DROP_NODE',
            payload: {
                droppedNodeId: 'n-lt90o0j9',
                targetNodeId: 'n-lt90nq7d',
                position: 'down',
            },
        } as const;
        const stateAfter = {
            content: {
                'n-lt90nq7d': { content: '1' },
                'n-lt90nv74': { content: '1.1' },
                'n-lt90nwh2': { content: '1.1.1' },
                'n-lt90nyee': { content: '1.1.2' },
                'n-lt90o0j9': { content: '1.1.3' },
                'n-lt90o4xa': { content: '1.1.3.1' },
                'n-lt90o8fj': { content: '1.1.3.2' },
            },
            columns: [
                {
                    id: 'c-lt90nq7e',
                    groups: [
                        {
                            nodes: ['n-lt90nq7d', 'n-lt90o0j9'],
                            parentId: 'r-lt90nq7c',
                        },
                    ],
                },
                {
                    id: 'c-lt90nv75',
                    groups: [
                        { nodes: ['n-lt90nv74'], parentId: 'n-lt90nq7d' },
                        {
                            nodes: ['n-lt90o4xa', 'n-lt90o8fj'],
                            parentId: 'n-lt90o0j9',
                        },
                    ],
                },
                {
                    id: 'c-lt90nwh3',
                    groups: [
                        {
                            nodes: ['n-lt90nwh2', 'n-lt90nyee'],
                            parentId: 'n-lt90nv74',
                        },
                    ],
                },
            ],
        };
        dropNode(state, action);
        expect(state).toEqual(stateAfter);
    });
});
