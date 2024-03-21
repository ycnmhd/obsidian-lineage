import { describe, expect, it } from 'vitest';
import { findNextActiveNodeOnKeyboardNavigation as findNext } from 'src/stores/view/reducers/document/helpers/find-next-node/find-next-active-node-on-keyboard-navigation';

const c0 = 'cAKE';
const c1 = 'cNHU';
const c2 = 'ciZm';
const c3 = 'cl1A';
const root = 'rA2T';
const n1 = 'noXJ';
const n2 = 'nOeL';
const n3 = 'nEBY';
const n1_1 = 'nopT';
const n1_2 = 'nEvT';
const n2_1 = 'nzge';
const n2_2 = 'neRg';
const n3_1 = 'nw3f';
const n3_2 = 'n5zq';
const n1_1_1 = 'nCDp';
const n1_1_2 = 'nGL8';
const n1_2_1 = 'nBqE';
const n1_2_2 = 'nnWc';
const n2_1_1 = 'nMjS';
const n3_1_1 = 'nXq8';
const n3_1_2 = 'nocr';
const n3_2_1 = 'nLJ6';
const n3_2_2 = 'n-jb';
const n1_1_1_1 = 'nTUx';
// const n1_1_1_2 = 'ni1K';
const n1_1_2_1 = 'nNDD';
const n1_1_2_2 = 'nU36';
const n1_2_1_1 = 'nbx4';
const n1_2_1_2 = 'nG0c';
const n1_2_2_1 = 'ndA6';
const n1_2_2_2 = 'nqFX';
const n2_1_1_1 = 'nswJ';
const n2_1_1_2 = 'nafe';
const n3_1_1_1 = 'neWU';
const n3_1_1_2 = 'n9DE';
const n3_1_2_1 = 'nqae';
const n3_1_2_2 = 'njrh';
const n3_2_1_1 = 'ntpl';
const n3_2_1_2 = 'nxhi';
const n3_2_2_1 = 'nLCq';
const n3_2_2_2 = 'nAtq';
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
                { nodes: [n2_1_1], parentId: n2_1 },
                { nodes: [n3_1_1, n3_1_2], parentId: n3_1 },
                { nodes: [n3_2_1, n3_2_2], parentId: n3_2 },
            ],
        },
        {
            id: c3,
            groups: [
                { nodes: [n1_1_1_1], parentId: n1_1_1 },
                { nodes: [n1_1_2_1, n1_1_2_2], parentId: n1_1_2 },
                { nodes: [n1_2_1_1, n1_2_1_2], parentId: n1_2_1 },
                { nodes: [n1_2_2_1, n1_2_2_2], parentId: n1_2_2 },
                { nodes: [n2_1_1_1, n2_1_1_2], parentId: n2_1_1 },
                { nodes: [n3_1_1_1, n3_1_1_2], parentId: n3_1_1 },
                { nodes: [n3_1_2_1, n3_1_2_2], parentId: n3_1_2 },
                { nodes: [n3_2_1_1, n3_2_1_2], parentId: n3_2_1 },
                { nodes: [n3_2_2_1, n3_2_2_2], parentId: n3_2_2 },
            ],
        },
    ],
    state: {},
};
describe('find next active node after deletion', () => {
    it('1', () => {
        expect(findNext(input.columns, n1, 'up')).toEqual(null);
        expect(findNext(input.columns, n1, 'left')).toEqual(null);
        expect(findNext(input.columns, n1, 'down')).toEqual(n2);
        expect(findNext(input.columns, n1, 'right')).toEqual(n1_1);
    });
    it('2', () => {
        expect(findNext(input.columns, n2, 'up')).toEqual(n1);
        expect(findNext(input.columns, n2, 'left')).toEqual(null);
        expect(findNext(input.columns, n2, 'down')).toEqual(n3);
        expect(findNext(input.columns, n2, 'right')).toEqual(n2_1);
    });

    it('3', () => {
        expect(findNext(input.columns, n3, 'up')).toEqual(n2);
        expect(findNext(input.columns, n3, 'left')).toEqual(null);
        expect(findNext(input.columns, n3, 'down')).toEqual(null);
        expect(findNext(input.columns, n3, 'right')).toEqual(n3_1);
    });

    it('1.1', () => {
        expect(findNext(input.columns, n1_1, 'up')).toEqual(null);
        expect(findNext(input.columns, n1_1, 'left')).toEqual(n1);
        expect(findNext(input.columns, n1_1, 'down')).toEqual(n1_2);
        expect(findNext(input.columns, n1_1, 'right')).toEqual(n1_1_1);
    });
    it('3.1', () => {
        expect(findNext(input.columns, n3_1, 'up')).toEqual(n2_2);
        expect(findNext(input.columns, n3_1, 'left')).toEqual(n3);
        expect(findNext(input.columns, n3_1, 'down')).toEqual(n3_2);
        expect(findNext(input.columns, n3_1, 'right')).toEqual(n3_1_1);
    });

    it('1.1.1', () => {
        expect(findNext(input.columns, n1_1_1, 'up')).toEqual(null);
        expect(findNext(input.columns, n1_1_1, 'left')).toEqual(n1_1);
        expect(findNext(input.columns, n1_1_1, 'down')).toEqual(n1_1_2);
        expect(findNext(input.columns, n1_1_1, 'right')).toEqual(n1_1_1_1);
    });
    it('1.2.1', () => {
        expect(findNext(input.columns, n1_2_1, 'up')).toEqual(n1_1_2);
        expect(findNext(input.columns, n1_2_1, 'left')).toEqual(n1_2);
        expect(findNext(input.columns, n1_2_1, 'down')).toEqual(n1_2_2);
        expect(findNext(input.columns, n1_2_1, 'right')).toEqual(n1_2_1_1);
    });

    it('2.1.1', () => {
        expect(findNext(input.columns, n2_1_1, 'up')).toEqual(n1_2_2);
        expect(findNext(input.columns, n2_1_1, 'left')).toEqual(n2_1);
        expect(findNext(input.columns, n2_1_1, 'down')).toEqual(n3_1_1);
        expect(findNext(input.columns, n2_1_1, 'right')).toEqual(n2_1_1_1);
    });

    it('3.2.2', () => {
        expect(findNext(input.columns, n3_2_2, 'up')).toEqual(n3_2_1);
        expect(findNext(input.columns, n3_2_2, 'left')).toEqual(n3_2);
        expect(findNext(input.columns, n3_2_2, 'down')).toEqual(null);
        expect(findNext(input.columns, n3_2_2, 'right')).toEqual(n3_2_2_1);
    });

    // resume here
    it('1.1.1.1', () => {
        expect(findNext(input.columns, n1_1_1_1, 'up')).toEqual(null);
        expect(findNext(input.columns, n1_1_1_1, 'left')).toEqual(n1_1_1);
        expect(findNext(input.columns, n1_1_1_1, 'down')).toEqual(n1_1_2_1);
        expect(findNext(input.columns, n1_1_1_1, 'right')).toEqual(null);
    });

    it('3.1.2.1', () => {
        expect(findNext(input.columns, n3_1_2_1, 'up')).toEqual(n3_1_1_2);
        expect(findNext(input.columns, n3_1_2_1, 'left')).toEqual(n3_1_2);
        expect(findNext(input.columns, n3_1_2_1, 'down')).toEqual(n3_1_2_2);
        expect(findNext(input.columns, n3_1_2_1, 'right')).toEqual(null);
    });
    it('3.2.2.2', () => {
        expect(findNext(input.columns, n3_2_2_2, 'up')).toEqual(n3_2_2_1);
        expect(findNext(input.columns, n3_2_2_2, 'left')).toEqual(n3_2_2);
        expect(findNext(input.columns, n3_2_2_2, 'down')).toEqual(null);
        expect(findNext(input.columns, n3_2_2_2, 'right')).toEqual(null);
    });
});
