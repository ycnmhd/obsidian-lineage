import { describe, expect, it } from 'vitest';
import { findNodeToJumpTo } from 'src/stores/view/reducers/document/state/helpers/find-next-node/find-node-to-jump-to';

describe('find node to jump to', () => {
    const c0 = 'cU9a';
    const c1 = 'cYxl';
    const c2 = 'cW5E';
    const c3 = 'cnug';
    const root = 'rntK';
    const n1 = 'na2X';
    const n2 = 'nzWN';
    const n3 = 'nQin';
    const n4 = 'na5A';
    const n5 = 'nW2p';
    const n6 = 'nzjE';
    const n7 = 'nPzW';
    const n8 = 'n2bo';
    const n9 = 'ndLl';
    const n10 = 'n4uO';
    const n11 = 'n6I5';
    const n1_1 = 'nc8-';
    const n1_2 = 'nea3';
    const n1_3 = 'naVu';
    const n2_1 = 'n9p1';
    const n3_1 = 'n09M';
    const n3_2 = 'nad9';
    const n3_3 = 'nkAR';
    const n5_1 = 'n_MP';
    const n5_2 = 'nOIR';
    const n7_1 = 'n3ak';
    const n7_2 = 'n3Po';
    const n8_1 = 'nu6A';
    const n8_2 = 'nj_B';
    const n8_3 = 'nI_z';
    const n3_3_1 = 'np91';
    const n3_3_2 = 'n2mD';
    const n3_3_3 = 'nXaj';
    const n3_3_4 = 'n6nk';
    const n7_2_1 = 'n_7r';
    const n7_2_2 = 'nq81';
    const n7_2_3 = 'nm0M';
    const n7_2_4 = 'nL1P';
    const n3_3_4_1 = 'n0WQ';
    const n3_3_4_2 = 'n068';
    const n7_2_4_1 = 'nv3k';
    const n7_2_4_2 = 'nivm';
    const input = {
        columns: [
            {
                id: c0,
                groups: [
                    {
                        nodes: [n1, n2, n3, n4, n5, n6, n7, n8, n9, n10, n11],
                        parentId: root,
                    },
                ],
            },
            {
                id: c1,
                groups: [
                    { nodes: [n1_1, n1_2, n1_3], parentId: n1 },
                    { nodes: [n2_1], parentId: n2 },
                    { nodes: [n3_1, n3_2, n3_3], parentId: n3 },
                    { nodes: [n5_1, n5_2], parentId: n5 },
                    { nodes: [n7_1, n7_2], parentId: n7 },
                    { nodes: [n8_1, n8_2, n8_3], parentId: n8 },
                ],
            },
            {
                id: c2,
                groups: [
                    {
                        nodes: [n3_3_1, n3_3_2, n3_3_3, n3_3_4],
                        parentId: n3_3,
                    },
                    {
                        nodes: [n7_2_1, n7_2_2, n7_2_3, n7_2_4],
                        parentId: n7_2,
                    },
                ],
            },
            {
                id: c3,
                groups: [
                    { nodes: [n3_3_4_1, n3_3_4_2], parentId: n3_3_4 },
                    { nodes: [n7_2_4_1, n7_2_4_2], parentId: n7_2_4 },
                ],
            },
        ],
        state: {},
    };
    it('n3_3 start-of-group', () => {
        const node = n3_3;
        const output = n3_1;
        const result = findNodeToJumpTo(input.columns, node, 'start-of-group');
        expect(result).toEqual(output);
    });
    it('n7_2_2 end-of-group', () => {
        const node = n7_2_2;
        const output = n7_2_4;
        const result = findNodeToJumpTo(input.columns, node, 'end-of-group');
        expect(result).toEqual(output);
    });
    it('n7_2_4_2 start-of-column', () => {
        const node = n7_2_4_2;
        const output = n3_3_4_1;
        const result = findNodeToJumpTo(input.columns, node, 'start-of-column');
        expect(result).toEqual(output);
    });
    it('n1_3 end-of-column', () => {
        const node = n1_3;
        const output = n8_3;
        const result = findNodeToJumpTo(input.columns, node, 'end-of-column');
        expect(result).toEqual(output);
    });
});
