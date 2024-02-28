import { describe, expect, it } from 'vitest';
import { findNextActiveNode } from 'src/stores/document/reducers/creation/helpers/find-next-active-node';

describe('find next active node', () => {
    it('should select parent', () => {
        const columns = [
            {
                id: 'c-lt1j9bsv',
                groups: [
                    {
                        nodes: [
                            {
                                id: 'n-lt1j9bsu',
                                content: '',
                                parentId: 'r-lt1j9bst',
                            },
                            {
                                id: 'n-lt1j9bt3',
                                content: '',
                                parentId: 'r-lt1j9bst',
                            },
                        ],
                        id: 'g-lt1j9bsw',
                        parentId: 'r-lt1j9bst',
                    },
                ],
            },
            {
                id: 'c-lt1j9bsy',
                groups: [
                    {
                        nodes: [
                            {
                                id: 'n-lt1j9bsx',
                                content: '',
                                parentId: 'n-lt1j9bsu',
                            },
                            {
                                id: 'n-lt1j9bt0',
                                content: '',
                                parentId: 'n-lt1j9bsu',
                            },
                            {
                                id: 'n-lt1j9bt1',
                                content: '',
                                parentId: 'n-lt1j9bsu',
                            },
                            {
                                id: 'n-lt1j9bt2',
                                content: '',
                                parentId: 'n-lt1j9bsu',
                            },
                        ],
                        id: 'g-lt1j9bsz',
                        parentId: 'n-lt1j9bsu',
                    },
                    {
                        nodes: [
                            {
                                id: 'n-lt1j9e9b',
                                parentId: 'n-lt1j9bt3',
                                content: '',
                            },
                        ],
                        parentId: 'n-lt1j9bt3',
                        id: 'g-lt1j9e9c',
                    },
                ],
            },
        ];
        const node = { id: 'n-lt1j9e9b', parentId: 'n-lt1j9bt3', content: '' };
        const nextNode = findNextActiveNode(columns, node);
        const output = {
            id: 'n-lt1j9bt3',
            content: '',
            parentId: 'r-lt1j9bst',
        };
        expect(nextNode).toEqual(output);
    });

    it('case 2', () => {
        const columns = [
            {
                id: 'c-lt1r64ql',
                groups: [
                    {
                        parentId: 'r-lt1r64qj',
                        nodes: [
                            {
                                id: 'n-lt1r64qk',
                                parentId: 'r-lt1r64qj',
                                content: '',
                            },
                            {
                                id: 'n-lt1r66fm',
                                parentId: 'r-lt1r64qj',
                                content: '',
                            },
                        ],
                        id: 'g-lt1r64qm',
                    },
                ],
            },
        ];
        const node = { id: 'n-lt1r64qk', parentId: 'r-lt1r64qj', content: '' };
        const output = {
            id: 'n-lt1r66fm',
            parentId: 'r-lt1r64qj',
            content: '',
        };
        expect(findNextActiveNode(columns, node)).toEqual(output);
    });
});
