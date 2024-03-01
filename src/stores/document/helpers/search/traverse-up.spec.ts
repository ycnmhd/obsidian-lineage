import { describe, expect, it } from 'vitest';
import { traverseUp } from 'src/stores/document/helpers/search/traverse-up';

describe('traverse-up', () => {
    it('case 1', () => {
        const nodeId = 'n-lt8q9zvu';
        const parentId1 = 'n-lt8q9zvr';
        const parentId2 = 'n-lt8q9zvo';
        const columns = [
            {
                id: 'c-lt8q9zvp',
                groups: [
                    {
                        nodes: [
                            parentId2,
                            'n-lt8q9zvy',
                            'n-lt8q9zvz',
                            'n-lt8q9zw0',
                            'n-lt8q9zw1',
                            'n-lt8q9zw2',
                            'n-lt8q9zw3',
                        ],
                        id: 'g-lt8q9zvq',
                        parentId: 'r-lt8q9zvn',
                    },
                ],
            },
            {
                id: 'c-lt8q9zvs',
                groups: [
                    {
                        nodes: [parentId1],
                        id: 'g-lt8q9zvt',
                        parentId: parentId2,
                    },
                    {
                        nodes: [
                            'n-lt8q9zw4',
                            'n-lt8q9zw6',
                            'n-lt8q9zw7',
                            'n-lt8q9zw8',
                        ],
                        id: 'g-lt8q9zw5',
                        parentId: 'n-lt8q9zw3',
                    },
                ],
            },
            {
                id: 'c-lt8q9zvv',
                groups: [
                    {
                        nodes: [nodeId, 'n-lt8q9zvx'],
                        id: 'g-lt8q9zvw',
                        parentId: parentId1,
                    },
                    {
                        nodes: ['n-lt8q9zw9'],
                        id: 'g-lt8q9zwa',
                        parentId: 'n-lt8q9zw8',
                    },
                ],
            },
        ];
        const parents = [parentId1, parentId2];
        expect(traverseUp(columns, nodeId)).toEqual(parents);
    });
});
