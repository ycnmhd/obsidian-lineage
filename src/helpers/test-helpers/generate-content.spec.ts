import { describe, expect, it } from 'vitest';
import { generateContent } from 'src/helpers/test-helpers/generate-content';

describe('generate-content', () => {
    it('should generate content', () => {
        const c0 = 'cK_J';
        const c1 = 'cnTn';
        const c2 = 'czcJ';
        const root = 'r9Jc';
        const n1 = 'nnUL';
        const n1_1 = 'ntg5';
        const n1_2 = 'nrRn';
        const n2 = 'nlGO';
        const n2_1 = 'nnBS';
        const n2_2 = 'nm53';
        const n3 = 'ndbX';
        const n3_1 = 'n92e';
        const n3_2 = 'nPls';
        const n1_1_1 = 'nZ8f';
        const n1_1_2 = 'n4ak';
        const n1_2_1 = 'n_aJ';
        const n1_2_2 = 'ndCx';
        const n2_1_1 = 'nQEv';
        const n2_1_2 = 'n1bY';
        const n2_2_1 = 'nGSg';
        const n2_2_2 = 'nZAS';
        const n3_1_1 = 'nppN';
        const n3_1_2 = 'nDYT';
        const n3_2_1 = 'nfuk';
        const n3_2_2 = 'nC6y';
        const input = {
            columns: [
                { id: c0, groups: [{ nodes: [n1, n2, n3], parentId: root }] },
                {
                    id: c1,
                    groups: [
                        { nodes: [n1_1, n1_2], parentId: n1 },
                        { nodes: [n2_1, n2_2], parentId: n2 },
                        { nodes: [n3_1, n3_2], parentId: n3 },
                    ],
                },
                {
                    id: c2,
                    groups: [
                        { nodes: [n1_1_1, n1_1_2], parentId: n1_1 },
                        { nodes: [n1_2_1, n1_2_2], parentId: n1_2 },
                        { nodes: [n2_1_1, n2_1_2], parentId: n2_1 },
                        { nodes: [n2_2_1, n2_2_2], parentId: n2_2 },
                        { nodes: [n3_1_1, n3_1_2], parentId: n3_1 },
                        { nodes: [n3_2_1, n3_2_2], parentId: n3_2 },
                    ],
                },
            ],
        };
        const output = {
            content: {
                [n1]: { content: '1' },
                [n1_1]: { content: '1.1' },
                [n1_2]: { content: '1.2' },
                [n2]: { content: '2' },
                [n2_1]: { content: '2.1' },
                [n2_2]: { content: '2.2' },
                [n3]: { content: '3' },
                [n3_1]: { content: '3.1' },
                [n3_2]: { content: '3.2' },
                [n1_1_1]: { content: '1.1.1' },
                [n1_1_2]: { content: '1.1.2' },
                [n1_2_1]: { content: '1.2.1' },
                [n1_2_2]: { content: '1.2.2' },
                [n2_1_1]: { content: '2.1.1' },
                [n2_1_2]: { content: '2.1.2' },
                [n2_2_1]: { content: '2.2.1' },
                [n2_2_2]: { content: '2.2.2' },
                [n3_1_1]: { content: '3.1.1' },
                [n3_1_2]: { content: '3.1.2' },
                [n3_2_1]: { content: '3.2.1' },
                [n3_2_2]: { content: '3.2.2' },
            },
        };
        expect(generateContent(input.columns)).toEqual(output.content);
    });
});
