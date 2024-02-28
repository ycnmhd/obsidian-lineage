import { describe, expect, it } from 'vitest';
import { deleteNode } from 'src/stores/document/reducers/creation/delete-node';
import { DocumentState } from 'src/stores/document/document-reducer';

describe('delete node', () => {
    const content = '';
    it('should delete node', () => {
        const input = {
            columns: [
                {
                    id: 'c-lt1jmx8b',
                    groups: [
                        {
                            nodes: [
                                {
                                    id: 'n-lt1jmx8a',
                                    content: content,
                                    parentId: 'r-lt1jmx89',
                                },
                                {
                                    id: 'n-lt1jmx8j',
                                    content: content,
                                    parentId: 'r-lt1jmx89',
                                },
                            ],
                            id: 'g-lt1jmx8c',
                            parentId: 'r-lt1jmx89',
                        },
                    ],
                },
                {
                    id: 'c-lt1jmx8e',
                    groups: [
                        {
                            nodes: [
                                {
                                    id: 'n-lt1jmx8d',
                                    content: content,
                                    parentId: 'n-lt1jmx8a',
                                },
                                {
                                    id: 'n-lt1jmx8g',
                                    content: content,
                                    parentId: 'n-lt1jmx8a',
                                },
                                {
                                    id: 'n-lt1jmx8h',
                                    content: content,
                                    parentId: 'n-lt1jmx8a',
                                },
                                {
                                    id: 'n-lt1jmx8i',
                                    content: content,
                                    parentId: 'n-lt1jmx8a',
                                },
                            ],
                            id: 'g-lt1jmx8f',
                            parentId: 'n-lt1jmx8a',
                        },
                    ],
                },
            ],
            state: {
                activeBranch: {
                    node: 'n-lt1jmx8g',
                    childNodes: {},
                    childGroups: {},
                    parentNodes: {},
                    siblingNodes: {},
                },
                draggedBranch: { node: content, childGroups: {} },
                editing: { activeNodeId: content, savePreviousNode: true },
            },
        };
        const output = {
            columns: [
                {
                    id: 'c-lt1jmx8b',
                    groups: [
                        {
                            nodes: [
                                {
                                    id: 'n-lt1jmx8a',
                                    content: content,
                                    parentId: 'r-lt1jmx89',
                                },
                                {
                                    id: 'n-lt1jmx8j',
                                    content: content,
                                    parentId: 'r-lt1jmx89',
                                },
                            ],
                            id: 'g-lt1jmx8c',
                            parentId: 'r-lt1jmx89',
                        },
                    ],
                },
                {
                    id: 'c-lt1jmx8e',
                    groups: [
                        {
                            nodes: [
                                {
                                    id: 'n-lt1jmx8d',
                                    content: content,
                                    parentId: 'n-lt1jmx8a',
                                },
                                {
                                    id: 'n-lt1jmx8h',
                                    content: content,
                                    parentId: 'n-lt1jmx8a',
                                },
                                {
                                    id: 'n-lt1jmx8i',
                                    content: content,
                                    parentId: 'n-lt1jmx8a',
                                },
                            ],
                            id: 'g-lt1jmx8f',
                            parentId: 'n-lt1jmx8a',
                        },
                    ],
                },
            ],
            state: {
                activeBranch: {
                    node: 'n-lt1jmx8d',
                    childNodes: {},
                    childGroups: {},
                    parentNodes: {},
                    siblingNodes: {},
                },
                draggedBranch: { node: content, childGroups: {} },
                editing: { activeNodeId: content, savePreviousNode: true },
            },
        };
        deleteNode(input as DocumentState);
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
        const stateBefore = {
            columns: [
                {
                    id: 'c-lt3bize3',
                    groups: [
                        {
                            nodes: [
                                {
                                    id: aboveDeleteNode,
                                    content: content,
                                    parentId: 'r-lt3bize1',
                                },
                                {
                                    id: deletedNode,
                                    content: content,
                                    parentId: 'r-lt3bize1',
                                },
                                {
                                    id: belowDeletedNode,
                                    content: content,
                                    parentId: 'r-lt3bize1',
                                },
                            ],
                            id: 'g-lt3bize4',
                            parentId: 'r-lt3bize1',
                        },
                    ],
                },
                {
                    id: 'c-lt3bize7',
                    groups: [
                        {
                            nodes: [
                                {
                                    id: 'n-lt3bize6',
                                    content: content,
                                    parentId: deletedNode,
                                },
                                {
                                    id: 'n-lt3bize9',
                                    content: content,
                                    parentId: deletedNode,
                                },
                            ],
                            id: childGroup1,
                            parentId: deletedNode,
                        },
                    ],
                },
                {
                    id: 'c-lt3bizeb',
                    groups: [
                        {
                            nodes: [
                                {
                                    id: 'n-lt3bizea',
                                    content: content,
                                    parentId: 'n-lt3bize9',
                                },
                            ],
                            id: childGroup2,
                            parentId: 'n-lt3bize9',
                        },
                    ],
                },
                {
                    id: 'c-lt3bizee',
                    groups: [
                        {
                            nodes: [
                                {
                                    id: 'n-lt3bized',
                                    content: content,
                                    parentId: 'n-lt3bizea',
                                },
                            ],
                            id: childGroup3,
                            parentId: 'n-lt3bizea',
                        },
                    ],
                },
                {
                    id: 'c-lt3bizeh',
                    groups: [
                        {
                            nodes: [
                                {
                                    id: 'n-lt3bizeg',
                                    content: content,
                                    parentId: 'n-lt3bized',
                                },
                            ],
                            id: childGroup4,
                            parentId: 'n-lt3bized',
                        },
                    ],
                },
            ],
            state: {
                activeBranch: {
                    node: deletedNode,
                    childNodes: new Set([
                        'n-lt3bize6',
                        'n-lt3bize9',
                        'n-lt3bizea',
                        'n-lt3bized',
                        'n-lt3bizeg',
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
                ui: { showHistorySidebar: false, showHelpSidebar: false },
            },
            file: {
                path: 'Untitled.md',
                frontmatter: '',
            },
        };

        const stateAfter = {
            columns: [
                {
                    id: 'c-lt3bize3',
                    groups: [
                        {
                            nodes: [
                                {
                                    id: aboveDeleteNode,
                                    content: content,
                                    parentId: 'r-lt3bize1',
                                },
                                {
                                    id: belowDeletedNode,
                                    content: content,
                                    parentId: 'r-lt3bize1',
                                },
                            ],
                            id: 'g-lt3bize4',
                            parentId: 'r-lt3bize1',
                        },
                    ],
                },

                { id: 'c-lt3bize7', groups: [] },
                { id: 'c-lt3bizeb', groups: [] },
                { id: 'c-lt3bizee', groups: [] },
                { id: 'c-lt3bizeh', groups: [] },
            ],
            state: {
                activeBranch: {
                    node: aboveDeleteNode,
                    childNodes: new Set(),
                    childGroups: new Set(),
                    parentNodes: new Set(),
                    siblingNodes: new Set([belowDeletedNode]),
                    sortedParentNodes: [],
                    group: 'g-lt3bize4',
                },
                draggedBranch: { node: content, childGroups: new Set() },
                editing: { activeNodeId: '', savePreviousNode: true },
                ui: { showHistorySidebar: false, showHelpSidebar: false },
            },
            file: {
                path: 'Untitled.md',
                frontmatter: '',
            },
        };
        deleteNode(stateBefore as unknown as DocumentState);
        expect(stateBefore).toEqual(stateAfter);
    });
});
