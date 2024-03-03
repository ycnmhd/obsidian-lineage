import { dropNode } from 'src/stores/document/reducers/structure/drop-node/drop-node';
import { describe, expect, it } from 'vitest';

describe.skip('drop-node', () => {
    it('case 3', () => {
        const dropped = 'dropped';
        const target = 'target';
        const dropped_parent = 'dropped_parent';
        const target_parent = 'target_parent';
        const dropped_child_1 = 'dropped_child_1';
        const dropped_child_2 = 'dropped_child_2';
        const target_sibling = 'target_sibling';
        const input = {
            columns: [
                {
                    id: 'c5dE',
                    groups: [
                        { nodes: [dropped_parent, 'nEaO'], parentId: 'rHIk' },
                    ],
                },
                {
                    id: 'c9a8',
                    groups: [
                        {
                            nodes: [
                                'nhux',
                                'nmnS',
                                target_parent,
                                'nl5m',
                                dropped,
                            ],
                            parentId: dropped_parent,
                        },
                    ],
                },
                {
                    id: 'c_dC',
                    groups: [
                        {
                            nodes: [target, target_sibling],
                            parentId: target_parent,
                        },
                        {
                            nodes: [dropped_child_1, dropped_child_2],
                            parentId: dropped,
                        },
                    ],
                },
                {
                    id: 'cNjn',
                    groups: [{ nodes: ['nmXU'], parentId: target_sibling }],
                },
            ],
            state: {
                activeBranch: {
                    parentNodes: new Set([dropped_parent]),
                    childGroups: new Set([dropped]),
                    childNodes: new Set([dropped_child_1, dropped_child_2]),
                    siblingNodes: new Set([
                        'nhux',
                        'nmnS',
                        target_parent,
                        'nl5m',
                    ]),
                    sortedParentNodes: [dropped_parent],
                    node: dropped,
                    group: dropped_parent,
                },
                dnd: { node: dropped, childGroups: new Set([dropped]) },
                editing: { activeNodeId: '', savePreviousNode: true },
            },
            action: {
                type: 'DROP_NODE',
                payload: {
                    droppedNodeId: dropped,
                    targetNodeId: target,
                    position: 'right',
                },
            } as const,
        };
        const expected = 'cYkA';
        const output = {
            columns: [
                {
                    id: 'c5dE',
                    groups: [
                        { nodes: [dropped_parent, 'nEaO'], parentId: 'rHIk' },
                    ],
                },
                {
                    id: 'c9a8',
                    groups: [
                        {
                            nodes: ['nhux', 'nmnS', target_parent, 'nl5m'],
                            parentId: dropped_parent,
                        },
                    ],
                },
                {
                    id: 'c_dC',
                    groups: [
                        {
                            nodes: [target, target_sibling],
                            parentId: target_parent,
                        },
                    ],
                },
                {
                    id: 'cNjn',
                    groups: [
                        { nodes: [dropped], parentId: target },
                        { nodes: ['nmXU'], parentId: target_sibling },
                    ],
                },
                {
                    id: expected,
                    groups: [
                        {
                            nodes: [dropped_child_1, dropped_child_2],
                            parentId: dropped,
                        },
                    ],
                },
            ],
            state: {
                activeBranch: {
                    parentNodes: new Set([
                        target,
                        target_parent,
                        dropped_parent,
                    ]),
                    childGroups: new Set([dropped]),
                    childNodes: new Set([dropped_child_1, dropped_child_2]),
                    siblingNodes: new Set([]),
                    sortedParentNodes: [dropped_parent, target_parent, target],
                    node: dropped,
                    group: target,
                },
                dnd: { node: '', childGroups: new Set([]) },
                editing: { activeNodeId: '', savePreviousNode: true },
            },
        };

        dropNode(input.columns, input.state, input.action);
        // IDs are arbitrary
        input.columns[4].id = expected;
        expect(input.columns).toEqual(output.columns);
        expect(input.state).toEqual(output.state);
    });

    it('case 4', () => {
        const input = {
            columns: [
                {
                    id: 'cJ1L',
                    groups: [{ nodes: ['nx63', 'nakr'], parentId: 'r89U' }],
                },
                {
                    id: 'coPb',
                    groups: [
                        {
                            nodes: ['nsSr', 'nL1D', 'nJQw', 'nWD9', 'nHnC'],
                            parentId: 'nx63',
                        },
                    ],
                },
                {
                    id: 'c3hb',
                    groups: [
                        { nodes: ['n2YO', 'nd_k'], parentId: 'nJQw' },
                        { nodes: ['nOFt', 'njar'], parentId: 'nHnC' },
                    ],
                },
                { id: 'cYv0', groups: [{ nodes: ['nbnU'], parentId: 'nd_k' }] },
            ],
            state: {
                activeBranch: {
                    parentNodes: new Set([]),
                    childGroups: new Set(['nx63', 'nJQw', 'nd_k', 'nHnC']),
                    childNodes: new Set([
                        'nsSr',
                        'nL1D',
                        'nJQw',
                        'n2YO',
                        'nd_k',
                        'nbnU',
                        'nWD9',
                        'nHnC',
                        'nOFt',
                        'njar',
                    ]),
                    siblingNodes: new Set(['nakr']),
                    sortedParentNodes: [],
                    node: 'nx63',
                    group: 'r89U',
                },
                dnd: { node: 'nJQw', childGroups: new Set(['nJQw', 'nd_k']) },
                editing: { activeNodeId: '', savePreviousNode: false },
            },
            action: {
                type: 'DROP_NODE',
                payload: {
                    droppedNodeId: 'nJQw',
                    targetNodeId: 'nakr',
                    position: 'down',
                },
            } as const,
        };
        const output = {
            columns: [
                {
                    id: 'cJ1L',
                    groups: [
                        { nodes: ['nx63', 'nakr', 'nJQw'], parentId: 'r89U' },
                    ],
                },
                {
                    id: 'coPb',
                    groups: [
                        {
                            nodes: ['nsSr', 'nL1D', 'nWD9', 'nHnC'],
                            parentId: 'nx63',
                        },
                        { nodes: ['n2YO', 'nd_k'], parentId: 'nJQw' },
                    ],
                },
                {
                    id: 'c3hb',
                    groups: [
                        { nodes: ['nOFt', 'njar'], parentId: 'nHnC' },
                        { nodes: ['nbnU'], parentId: 'nd_k' },
                    ],
                },
            ],
            state: {
                activeBranch: {
                    parentNodes: new Set([]),
                    childGroups: new Set(['nJQw', 'nd_k']),
                    childNodes: new Set(['n2YO', 'nd_k', 'nbnU']),
                    siblingNodes: new Set(['nx63', 'nakr']),
                    sortedParentNodes: [],
                    node: 'nJQw',
                    group: 'r89U',
                },
                dnd: { node: '', childGroups: new Set([]) },
                editing: { activeNodeId: '', savePreviousNode: true },
            },
        };
        dropNode(input.columns, input.state, input.action);
        expect(input.columns).toEqual(output.columns);
        expect(output.state).toEqual(output.state);
    });
});
