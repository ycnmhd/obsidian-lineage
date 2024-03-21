import { describe, expect, it } from 'vitest';

import { findNodeAtPosition } from 'src/stores/view/helpers/search/find-node-at-position';
import { Column } from 'src/stores/document/document-state-type';

describe('find node at position', () => {
    it('should find node', () => {
        const position = {
            columnIndex: 1,
            groupIndex: 0,
            nodeIndex: 0,
        };
        const columns: Column[] = [
            {
                id: 'c-lt19ii7v',
                groups: [
                    {
                        nodes: ['n-lt19ii7u', 'n-lt19ii7x', 'n-lt19ii81'],
                        parentId: 'r-lt19ii7t',
                    },
                ],
            },
            {
                id: 'c-lt19ii7z',
                groups: [
                    {
                        nodes: ['n-lt19ii7y'],
                        parentId: 'n-lt19ii7x',
                    },
                ],
            },
        ];

        const node = findNodeAtPosition(columns, position);
        expect(node).toBeTruthy();
        expect(node).toBe('n-lt19ii7y');
    });
});
