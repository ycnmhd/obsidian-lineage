import { describe, expect, it } from 'vitest';
import { findNodePosition } from 'src/stores/view/helpers/search/find-node-position';
import { Column } from 'src/stores/document/document-state-type';

describe('find node position', () => {
    it('should find position', () => {
        const columns: Column[] = [
            {
                id: 'c-lt1aha5j',
                groups: [
                    {
                        nodes: [
                            'n-lt1aha5i',
                            'n-lt1aha5o',
                            'n-lt1aha5p',
                            'n-lt1aha5q',
                            'n-lt1aha5r',
                            'n-lt1aha5s',
                        ],
                        parentId: 'r-lt1aha5h',
                    },
                ],
            },
            {
                id: 'c-lt1aha5m',
                groups: [
                    {
                        nodes: ['n-lt1aha5l'],
                        parentId: 'n-lt1aha5i',
                    },
                ],
            },
        ];

        const node = 'n-lt1aha5l';
        expect(findNodePosition(columns, node)).toEqual({
            columnIndex: 1,
            groupIndex: 0,
            nodeIndex: 0,
        });
    });
});
