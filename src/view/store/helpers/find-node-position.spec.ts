import { describe, expect, it } from 'vitest';
import { findNodePosition } from 'src/view/store/helpers/find-branch';

describe('find node position', () => {
    it('should find position', () => {
        const columns = [
            {
                id: 'c-lt1aha5j',
                groups: [
                    {
                        nodes: [
                            {
                                id: 'n-lt1aha5i',
                                content: '',
                                parentId: 'r-lt1aha5h',
                            },
                            {
                                id: 'n-lt1aha5o',
                                content: '',
                                parentId: 'r-lt1aha5h',
                            },
                            {
                                id: 'n-lt1aha5p',
                                content: '',
                                parentId: 'r-lt1aha5h',
                            },
                            {
                                id: 'n-lt1aha5q',
                                content: '',
                                parentId: 'r-lt1aha5h',
                            },
                            {
                                id: 'n-lt1aha5r',
                                content: '',
                                parentId: 'r-lt1aha5h',
                            },
                            {
                                id: 'n-lt1aha5s',
                                content: '',
                                parentId: 'r-lt1aha5h',
                            },
                        ],
                        id: 'g-lt1aha5k',
                        parentId: 'r-lt1aha5h',
                    },
                ],
            },
            {
                id: 'c-lt1aha5m',
                groups: [
                    {
                        nodes: [
                            {
                                id: 'n-lt1aha5l',
                                content: '',
                                parentId: 'n-lt1aha5i',
                            },
                        ],
                        id: 'g-lt1aha5n',
                        parentId: 'n-lt1aha5i',
                    },
                ],
            },
        ];

        const node = {
            id: 'n-lt1aha5l',
            content: '',
            parentId: 'n-lt1aha5i',
        };
        expect(findNodePosition(columns, node)).toEqual({
            columnIndex: 1,
            groupIndex: 0,
            nodeIndex: 0,
        });
    });
});
