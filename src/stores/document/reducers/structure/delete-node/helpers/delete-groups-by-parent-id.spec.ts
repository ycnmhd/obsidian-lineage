import { describe, expect, it } from 'vitest';
import { deleteGroupsByParentId } from 'src/stores/document/reducers/structure/delete-node/helpers/delete-groups-by-parent-id';

describe('delete-groups-by-parent-id', () => {
    it(() => {
        const parentId1 = 'n-lt3bize5';
        const parentId2 = 'n-lt3bize9';
        const parentId3 = 'n-lt3bizea';
        const parentId4 = 'n-lt3bized';
        const document = {
            content: {},
            columns: [
                {
                    id: 'c-lt3bize3',
                    groups: [
                        {
                            nodes: ['n-lt3bize2', parentId1, 'n-lt3bizej'],
                            parentId: 'r-lt3bize1',
                        },
                    ],
                },
                {
                    id: 'c-lt3bize7',
                    groups: [
                        {
                            nodes: ['n-lt3bize6', parentId2],
                            parentId: parentId1,
                        },
                    ],
                },
                {
                    id: 'c-lt3bizeb',
                    groups: [{ nodes: [parentId3], parentId: parentId2 }],
                },
                {
                    id: 'c-lt3bizee',
                    groups: [{ nodes: [parentId4], parentId: parentId3 }],
                },
                {
                    id: 'c-lt3bizeh',
                    groups: [{ nodes: ['n-lt3bizeg'], parentId: parentId4 }],
                },
            ],
        };
        const parentIds = new Set([parentId1, parentId2, parentId3, parentId4]);
        const documentAfter = {
            content: {},
            columns: [
                {
                    id: 'c-lt3bize3',
                    groups: [
                        {
                            nodes: ['n-lt3bize2', parentId1, 'n-lt3bizej'],
                            parentId: 'r-lt3bize1',
                        },
                    ],
                },
                {
                    id: 'c-lt3bize7',
                    groups: [],
                },
                {
                    id: 'c-lt3bizeb',
                    groups: [],
                },
                {
                    id: 'c-lt3bizee',
                    groups: [],
                },
                {
                    id: 'c-lt3bizeh',
                    groups: [],
                },
            ],
        };

        deleteGroupsByParentId(document.columns, document.content, parentIds);
        expect(document).toEqual(documentAfter);
    });
});
