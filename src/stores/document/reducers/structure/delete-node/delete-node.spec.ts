import { describe, expect, it } from 'vitest';
import { deleteNode } from 'src/stores/document/reducers/structure/delete-node/delete-node';

import { DocumentInstance } from 'src/stores/document/document-type';

describe('delete node', () => {
    const content = '';
    it('should delete node', () => {
        const input = {
            document: {
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
            },
            state: {
                activeBranch: {
                    node: 'n-lt1jmx8g',
                    childNodes: new Set<string>(),
                    childGroups: new Set<string>(),
                    parentNodes: new Set<string>(),
                    siblingNodes: new Set<string>(),
                    group: '',
                    sortedParentNodes: [],
                },
                draggedBranch: {
                    node: content,
                    childGroups: new Set<string>(),
                },
                editing: { activeNodeId: content, savePreviousNode: true },
            },
        } satisfies DocumentInstance;
        const output = {
            document: {
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
                                    'n-lt1jmx8h',
                                    'n-lt1jmx8i',
                                ],
                                parentId: 'n-lt1jmx8a',
                            },
                        ],
                    },
                ],
            },
            state: {
                activeBranch: {
                    node: 'n-lt1jmx8d',
                    childNodes: new Set<string>(),
                    childGroups: new Set<string>(),
                    parentNodes: new Set<string>(),
                    siblingNodes: new Set<string>(),
                    sortedParentNodes: [],
                    group: '',
                },
                draggedBranch: {
                    node: content,
                    childGroups: new Set<string>(),
                },
                editing: { activeNodeId: content, savePreviousNode: true },
            },
        } satisfies DocumentInstance;
        deleteNode(input);
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
            document: {
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
            },
            state: {
                activeBranch: {
                    group: '',

                    node: deletedNode,
                    childNodes: new Set([
                        childNode1,
                        childNode2,
                        childNode3,
                        childNode4,
                        childNode5,
                    ]),
                    childGroups: new Set([
                        childGroup1,
                        childGroup2,
                        childGroup3,
                        childGroup4,
                    ]),
                    parentNodes: new Set(),
                    siblingNodes: new Set([
                        aboveDeleteNode,
                        deletedNode,
                        belowDeletedNode,
                    ]),
                    sortedParentNodes: [],
                },
                draggedBranch: { node: content, childGroups: new Set() },
                editing: { activeNodeId: content, savePreviousNode: true },
            },
        } satisfies DocumentInstance;

        const stateAfter = {
            document: {
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
            },
            state: {
                activeBranch: {
                    node: aboveDeleteNode,
                    childNodes: new Set(),
                    childGroups: new Set(),
                    parentNodes: new Set(),
                    siblingNodes: new Set([belowDeletedNode]),
                    sortedParentNodes: [],
                    group: 'r-lt3bize1',
                },
                draggedBranch: { node: content, childGroups: new Set() },
                editing: { activeNodeId: '', savePreviousNode: true },
            },
        } satisfies DocumentInstance;
        deleteNode(stateBefore);
        expect(stateBefore).toEqual(stateAfter);
    });

    it('case', () => {
        const activeNodeId = 'n-lt8wzcvn';
        const siblingNodId = 'n-lt8wz9zd';
        const state = {
            document: {
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
            },
            state: {
                activeBranch: {
                    parentNodes: new Set([]),
                    childGroups: new Set([]),
                    childNodes: new Set([]),
                    siblingNodes: new Set([siblingNodId]),
                    sortedParentNodes: [],
                    node: activeNodeId,
                    group: 'r-lt8wz9zc',
                },
                draggedBranch: { node: '', childGroups: new Set([]) },
                editing: { activeNodeId: '', savePreviousNode: true },
            },
        } satisfies DocumentInstance;

        const stateAfter = {
            document: {
                content: { 'n-lt8wz9zd': { content: 'one' } },
                columns: [
                    {
                        id: 'c-lt8wz9ze',
                        groups: [
                            { parentId: 'r-lt8wz9zc', nodes: [siblingNodId] },
                        ],
                    },
                ],
            },
            state: {
                activeBranch: {
                    parentNodes: new Set([]),
                    childGroups: new Set([]),
                    childNodes: new Set([]),
                    siblingNodes: new Set([]),
                    sortedParentNodes: [],
                    node: siblingNodId,
                    group: 'r-lt8wz9zc',
                },
                draggedBranch: { node: '', childGroups: new Set([]) },
                editing: { activeNodeId: '', savePreviousNode: true },
            },
        } satisfies DocumentInstance;

        deleteNode(state);
        expect(state).toEqual(stateAfter);
    });
});
