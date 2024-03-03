import { describe, expect, it } from 'vitest';
import { Column } from 'src/stores/view/view-state-type';
import { findNextNodeAfterDeletion } from 'src/stores/view/reducers/document/state/helpers/find-next-node/find-next-node-after-deletion';

describe('find next active node', () => {
    it('should select parent', () => {
        const columns: Column[] = [
            {
                id: 'c-lt1j9bsv',
                groups: [
                    {
                        nodes: ['n-lt1j9bsu', 'n-lt1j9bt3'],
                        parentId: 'r-lt1j9bst',
                    },
                ],
            },
            {
                id: 'c-lt1j9bsy',
                groups: [
                    {
                        nodes: [
                            'n-lt1j9bsx',
                            'n-lt1j9bt0',
                            'n-lt1j9bt1',
                            'n-lt1j9bt2',
                        ],
                        parentId: 'n-lt1j9bsu',
                    },
                    {
                        nodes: ['n-lt1j9e9b'],
                        parentId: 'n-lt1j9bt3',
                    },
                ],
            },
        ];
        const node = 'n-lt1j9e9b';
        const nextNode = findNextNodeAfterDeletion(columns, node);
        const output = 'n-lt1j9bt3';
        expect(nextNode).toEqual(output);
    });

    it('case 2', () => {
        const columns: Column[] = [
            {
                id: 'c-lt1r64ql',
                groups: [
                    {
                        parentId: 'r-lt1r64qj',
                        nodes: ['n-lt1r64qk', 'n-lt1r66fm'],
                    },
                ],
            },
        ];
        const node = 'n-lt1r64qk';
        const output = 'n-lt1r66fm';
        expect(findNextNodeAfterDeletion(columns, node)).toEqual(output);
    });
});
