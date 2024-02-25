import { describe, expect, it } from 'vitest';
import { deleteNode } from 'src/view/store/reducers/creation/delete-node';
import { DocumentState } from 'src/view/store/document-reducer';

describe('delete node', () => {
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
                                    content: '',
                                    parentId: 'r-lt1jmx89',
                                },
                                {
                                    id: 'n-lt1jmx8j',
                                    content: '',
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
                                    content: '',
                                    parentId: 'n-lt1jmx8a',
                                },
                                {
                                    id: 'n-lt1jmx8g',
                                    content: '',
                                    parentId: 'n-lt1jmx8a',
                                },
                                {
                                    id: 'n-lt1jmx8h',
                                    content: '',
                                    parentId: 'n-lt1jmx8a',
                                },
                                {
                                    id: 'n-lt1jmx8i',
                                    content: '',
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
                draggedBranch: { node: '', childGroups: {} },
                editing: { activeNodeId: '', savePreviousNode: true },
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
                                    content: '',
                                    parentId: 'r-lt1jmx89',
                                },
                                {
                                    id: 'n-lt1jmx8j',
                                    content: '',
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
                                    content: '',
                                    parentId: 'n-lt1jmx8a',
                                },
                                {
                                    id: 'n-lt1jmx8h',
                                    content: '',
                                    parentId: 'n-lt1jmx8a',
                                },
                                {
                                    id: 'n-lt1jmx8i',
                                    content: '',
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
                draggedBranch: { node: '', childGroups: {} },
                editing: { activeNodeId: '', savePreviousNode: true },
            },
        };
        deleteNode(input as DocumentState);
        expect(input.state.activeBranch.node).toEqual(
            output.state.activeBranch.node,
        );
    });
});
