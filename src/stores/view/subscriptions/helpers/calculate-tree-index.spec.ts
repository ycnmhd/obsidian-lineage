import { calculateColumnTreeIndexes } from 'src/stores/view/subscriptions/helpers/calculate-tree-index';
import { describe, expect, it } from 'vitest';

describe('calculate-tree-index', () => {
    it('case 1', () => {
        const n1 = 'nOJL';
        const n2 = 'nGDK';
        const n3 = 'nWFK';
        const n4 = 'nJnE';
        const n1_1 = 'nOux';
        const n1_2 = 'ndYt';
        const n2_1 = 'nCEd';
        const n2_2 = 'nZ9Y';
        const n3_1 = 'ncM5';
        const n4_1 = 'nnXx';
        const n4_1_1 = 'nOHk';
        const n4_1_2 = 'n28V';
        const n4_1_3 = 'n674';
        const columns = [
            {
                id: 'c0V0',
                groups: [
                    {
                        nodes: [n1, n2, n3, n4],
                        parentId: 'r8EG',
                    },
                ],
            },
            {
                id: 'cYuJ',
                groups: [
                    { nodes: [n1_1, n1_2], parentId: n1 },
                    { nodes: [n2_1, n2_2], parentId: n2 },
                    { nodes: [n3_1], parentId: n3 },
                    { nodes: [n4_1], parentId: n4 },
                ],
            },
            {
                id: 'cvDD',
                groups: [{ nodes: [n4_1_1, n4_1_2, n4_1_3], parentId: n4_1 }],
            },
        ];
        const treeIndexDict = {
            [n1]: '1',
            [n2]: '2',
            [n3]: '3',
            [n4]: '4',
            [n1_1]: '1.1',
            [n1_2]: '1.2',
            [n2_1]: '2.1',
            [n2_2]: '2.2',
            [n3_1]: '3.1',
            [n4_1]: '4.1',
            [n4_1_1]: '4.1.1',
            [n4_1_2]: '4.1.2',
            [n4_1_3]: '4.1.3',
        };
        expect(calculateColumnTreeIndexes(columns)).toEqual(treeIndexDict);
    });
});
