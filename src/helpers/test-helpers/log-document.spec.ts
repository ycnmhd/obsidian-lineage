import { expect, it } from 'vitest';
import { DocumentState } from 'src/stores/view/view-state-type';
import { __logDocument__ } from 'src/helpers/test-helpers/log-document';

it('should replace node IDs', () => {
    const input: DocumentState = {
        columns: [
            {
                id: 'cIaq',
                groups: [{ nodes: ['n-iE', 'n0_Y', 'nBnH'], parentId: 'rSPW' }],
            },
            {
                id: 'ct1L',
                groups: [
                    { nodes: ['nM2V', 'n6N2'], parentId: 'n-iE' },
                    { nodes: ['n3O0', 'nLp0'], parentId: 'n0_Y' },
                    { nodes: ['nuD9', 'nhqd'], parentId: 'nBnH' },
                ],
            },
        ],
        state: {
            activeNode: 'n-iE',
        },
        content: {
            'n-iE': { content: '1' },
            n0_Y: { content: '2' },
            nBnH: { content: '3' },
            nM2V: { content: '1.1' },
            n6N2: { content: '1.2' },
            n3O0: { content: '2.1' },
            nLp0: { content: '2.2' },
            nuD9: { content: '3.1' },
            nhqd: { content: '3.2' },
        },
    };

    const output = `const c0 = "cIaq";
const c1 = "ct1L";
const root = "rSPW";
const n1 = "n-iE";
const n2 = "n0_Y";
const n3 = "nBnH";
const n1_1 = "nM2V";
const n1_2 = "n6N2";
const n2_1 = "n3O0";
const n2_2 = "nLp0";
const n3_1 = "nuD9";
const n3_2 = "nhqd";
const input = {"columns":[{"id":c0,"groups":[{"nodes":[n1,n2,n3],"parentId":root}]},{"id":c1,"groups":[{"nodes":[n1_1,n1_2],"parentId":n1},{"nodes":[n2_1,n2_2],"parentId":n2},{"nodes":[n3_1,n3_2],"parentId":n3}]}],"state":{"activeNode":n1},"content": {[n1]: { content: "1" },[n2]: { content: "2" },[n3]: { content: "3" },[n1_1]: { content: "1.1" },[n1_2]: { content: "1.2" },[n2_1]: { content: "2.1" },[n2_2]: { content: "2.2" },[n3_1]: { content: "3.1" },[n3_2]: { content: "3.2" }}}`;
    expect(__logDocument__(input, 'input')).toEqual(output);
});
