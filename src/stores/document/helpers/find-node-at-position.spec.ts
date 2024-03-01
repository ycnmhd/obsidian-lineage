import { describe, expect, it } from 'vitest';

import { findNodeAtPosition } from 'src/stores/document/helpers/search/find-node-at-position';

describe('find node at position', () => {
    it('should find node', () => {
        const position = {
            columnIndex: 1,
            groupIndex: 0,
            nodeIndex: 0,
        };
        const columns = [
            {
                id: 'c-lt19ii7v',
                groups: [
                    {
                        nodes: [
                            {
                                id: 'n-lt19ii7u',
                                content: '',
                                parentId: 'r-lt19ii7t',
                            },
                            {
                                id: 'n-lt19ii7x',
                                content: '',
                                parentId: 'r-lt19ii7t',
                            },
                            {
                                id: 'n-lt19ii81',
                                content: '',
                                parentId: 'r-lt19ii7t',
                            },
                        ],
                        id: 'g-lt19ii7w',
                        parentId: 'r-lt19ii7t',
                    },
                ],
            },
            {
                id: 'c-lt19ii7z',
                groups: [
                    {
                        nodes: [
                            {
                                id: 'n-lt19ii7y',
                                content: '',
                                parentId: 'n-lt19ii7x',
                            },
                        ],
                        id: 'g-lt19ii80',
                        parentId: 'n-lt19ii7x',
                    },
                ],
            },
        ];

        const node = findNodeAtPosition(columns, position);
        expect(node).toBeTruthy();
        expect(node?.id).toBe('n-lt19ii7y');
    });
});
