import { describe, expect, it } from 'vitest';
import { deleteNode } from 'src/stores/document/reducers/structure/delete-node/delete-node';

import { DocumentState } from 'src/stores/document/document-type';

describe('delete node', () => {
    const content = '';
    it('should delete node', () => {
        const input = {
            content: {},
            columns: [
                {
                    id: 'c-lt1jmx8b',
                    groups: [
                        {
                            nodes: ['n-lt1jmx8a', 'n-lt1jmx8j'],
                            parentId: 'r-lt1jmx89',
                        },
                    ],
                },
                {
                    id: 'c-lt1jmx8e',
                    groups: [
                        {
                            nodes: [
                                'n-lt1jmx8d',
                                'n-lt1jmx8g',
                                'n-lt1jmx8h',
                                'n-lt1jmx8i',
                            ],
                            parentId: 'n-lt1jmx8a',
                        },
                    ],
                },
            ],
            state: {
                activeBranch: {
                    node: 'n-lt1jmx8g',
                    childGroups: new Set<string>(),

                    group: '',
                    sortedParentNodes: [],
                },
                dnd: {
                    node: content,
                    childGroups: new Set<string>(),
                },
                editing: { activeNodeId: content, savePreviousNode: true },
            },
        } satisfies DocumentState;
        const output = {
            content: {},
            columns: [
                {
                    id: 'c-lt1jmx8b',
                    groups: [
                        {
                            nodes: ['n-lt1jmx8a', 'n-lt1jmx8j'],
                            parentId: 'r-lt1jmx89',
                        },
                    ],
                },
                {
                    id: 'c-lt1jmx8e',
                    groups: [
                        {
                            nodes: ['n-lt1jmx8d', 'n-lt1jmx8h', 'n-lt1jmx8i'],
                            parentId: 'n-lt1jmx8a',
                        },
                    ],
                },
            ],
            state: {
                activeBranch: {
                    node: 'n-lt1jmx8d',
                    childGroups: new Set<string>(),

                    sortedParentNodes: [],
                    group: '',
                },
                dnd: {
                    node: content,
                    childGroups: new Set<string>(),
                },
                editing: { activeNodeId: content, savePreviousNode: true },
            },
        } satisfies DocumentState;
        deleteNode(input.columns, input.state, input.content, {
            type: 'TREE/DELETE_NODE',
        });
        expect(input.state.activeBranch.node).toEqual(
            output.state.activeBranch.node,
        );
    });

    it('bug 24-02-26', () => {
        const deletedNode = 'n-lt3bize5';
        const aboveDeleteNode = 'n-lt3bize2';
        const belowDeletedNode = 'n-lt3bizej';
        const childGroup1 = 'g-lt3bize8';
        const childGroup2 = 'g-lt3bizec';
        const childGroup3 = 'g-lt3bizef';
        const childGroup4 = 'g-lt3bizei';
        const childNode1 = 'n-lt3bize6';
        const childNode2 = 'n-lt3bize9';
        const childNode3 = 'n-lt3bizea';
        const childNode4 = 'n-lt3bized';
        const childNode5 = 'n-lt3bizeg';
        const stateBefore = {
            content: {},
            columns: [
                {
                    id: 'c-lt3bize3',
                    groups: [
                        {
                            nodes: [
                                aboveDeleteNode,
                                deletedNode,
                                belowDeletedNode,
                            ],
                            parentId: 'r-lt3bize1',
                        },
                    ],
                },
                {
                    id: 'c-lt3bize7',
                    groups: [
                        {
                            nodes: [childNode1, childNode2],
                            parentId: deletedNode,
                        },
                    ],
                },
                {
                    id: 'c-lt3bizeb',
                    groups: [
                        {
                            nodes: [childNode3],
                            parentId: childNode2,
                        },
                    ],
                },
                {
                    id: 'c-lt3bizee',
                    groups: [
                        {
                            nodes: [childNode4],
                            parentId: childNode3,
                        },
                    ],
                },
                {
                    id: 'c-lt3bizeh',
                    groups: [
                        {
                            nodes: [childNode5],
                            parentId: childNode4,
                        },
                    ],
                },
            ],
            state: {
                activeBranch: {
                    group: '',

                    node: deletedNode,
                    childGroups: new Set([
                        childGroup1,
                        childGroup2,
                        childGroup3,
                        childGroup4,
                    ]),

                    sortedParentNodes: [],
                },
                dnd: { node: content, childGroups: new Set() },
                editing: { activeNodeId: content, savePreviousNode: true },
            },
        } satisfies DocumentState;

        const stateAfter = {
            content: {},
            columns: [
                {
                    id: 'c-lt3bize3',
                    groups: [
                        {
                            nodes: [aboveDeleteNode, belowDeletedNode],
                            parentId: 'r-lt3bize1',
                        },
                    ],
                },
            ],
            state: {
                activeBranch: {
                    node: aboveDeleteNode,
                    childGroups: new Set(),

                    sortedParentNodes: [],
                    group: 'r-lt3bize1',
                },
                dnd: { node: content, childGroups: new Set() },
                editing: { activeNodeId: '', savePreviousNode: true },
            },
        } satisfies DocumentState;
        deleteNode(
            stateBefore.columns,
            stateBefore.state,
            stateBefore.content,
            { type: 'TREE/DELETE_NODE' },
        );
        expect(stateBefore).toEqual(stateAfter);
    });

    it('case', () => {
        const activeNodeId = 'n-lt8wzcvn';
        const siblingNodId = 'n-lt8wz9zd';
        const state = {
            content: {
                'n-lt8wz9zd': { content: 'one' },
                'n-lt8wzcvn': { content: 'two' },
            },
            columns: [
                {
                    id: 'c-lt8wz9ze',
                    groups: [
                        {
                            parentId: 'r-lt8wz9zc',
                            nodes: [siblingNodId, activeNodeId],
                        },
                    ],
                },
            ],
            state: {
                activeBranch: {
                    childGroups: new Set([]),
                    sortedParentNodes: [],
                    node: activeNodeId,
                    group: 'r-lt8wz9zc',
                },
                dnd: { node: '', childGroups: new Set([]) },
                editing: { activeNodeId: '', savePreviousNode: true },
            },
        } satisfies DocumentState;

        const stateAfter = {
            content: { 'n-lt8wz9zd': { content: 'one' } },
            columns: [
                {
                    id: 'c-lt8wz9ze',
                    groups: [{ parentId: 'r-lt8wz9zc', nodes: [siblingNodId] }],
                },
            ],
            state: {
                activeBranch: {
                    childGroups: new Set([]),
                    sortedParentNodes: [],
                    node: siblingNodId,
                    group: 'r-lt8wz9zc',
                },
                dnd: { node: '', childGroups: new Set([]) },
                editing: { activeNodeId: '', savePreviousNode: true },
            },
        } satisfies DocumentState;

        deleteNode(state.columns, state.state, state.content, {
            type: 'TREE/DELETE_NODE',
        });
        expect(state).toEqual(stateAfter);
    });
});
