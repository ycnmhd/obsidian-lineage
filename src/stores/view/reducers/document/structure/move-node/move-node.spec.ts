import { describe, expect, test } from 'vitest';
import { moveNode } from 'src/stores/view/reducers/document/structure/move-node/move-node';

describe('move-node', () => {
    test('>1 2 down', () => {
        const mov = 'n5R6';
        const adj = 'nIaE';
        const root = 'rTSa';
        const col0 = 'cGHp';
        const input = {
            columns: [
                {
                    id: col0,
                    groups: [{ nodes: [mov, adj], parentId: root }],
                },
            ],
            state: {
                activeNode: mov,
            },
        };
        const action = {
            type: 'DOCUMENT/MOVE_NODE',
            payload: { direction: 'down' },
        } as const;
        const output = {
            columns: [
                {
                    id: col0,
                    groups: [{ nodes: [adj, mov], parentId: root }],
                },
            ],
            state: {
                activeNode: mov,
            },
        };
        moveNode(input.columns, input.state, action);
        expect(input).toEqual(output);
    });

    test('>1 2 right', () => {
        const action = {
            type: 'DOCUMENT/MOVE_NODE',
            payload: { direction: 'up' },
        } as const;
        const col = 'csCZ';
        const root = 'rGVl';
        const mov = 'neeO';
        const tar = 'nnGy';

        const input = {
            columns: [
                {
                    id: col,
                    groups: [{ nodes: [tar, mov], parentId: root }],
                },
            ],
            state: {
                activeNode: mov,
            },
        };
        const output = {
            columns: [
                {
                    id: col,
                    groups: [{ nodes: [mov, tar], parentId: root }],
                },
            ],
            state: {
                activeNode: mov,
            },
        };
        moveNode(input.columns, input.state, action);
        expect(input).toEqual(output);
    });
    test('>1 2 left', () => {
        const action = {
            type: 'DOCUMENT/MOVE_NODE',
            payload: { direction: 'right' },
        } as const;
        const mov = 'nvH_';
        const adj = 'nKUl';
        const root = 'rXVP';
        const col0 = 'cZcR';
        const input = {
            columns: [
                {
                    id: col0,
                    groups: [{ nodes: [mov, adj], parentId: root }],
                },
            ],
            state: {
                activeNode: mov,
            },
        };
        const col1 = 'cj8x';
        const output = {
            columns: [
                { id: col0, groups: [{ nodes: [adj], parentId: root }] },
                { id: col1, groups: [{ nodes: [mov], parentId: adj }] },
            ],
            state: {
                activeNode: mov,
            },
        };
        moveNode(input.columns, input.state, action);
        input.columns[1].id = col1;
        expect(input).toEqual(output);
    });
    test('1 >2 up', () => {
        const action = {
            type: 'DOCUMENT/MOVE_NODE',
            payload: { direction: 'up' },
        } as const;
        const col0 = 'cZcR';
        const mov = 'nKUl';
        const adj = 'nvH_';
        const root = 'rXVP';
        const input = {
            columns: [
                {
                    id: col0,
                    groups: [{ nodes: [adj, mov], parentId: root }],
                },
            ],
            state: {
                activeNode: mov,
            },
        };
        const output = {
            columns: [
                {
                    id: col0,
                    groups: [{ nodes: [mov, adj], parentId: root }],
                },
            ],
            state: {
                activeNode: mov,
            },
        };
        moveNode(input.columns, input.state, action);
        expect(input).toEqual(output);
    });
    test('1 >2 down', () => {
        const action = {
            type: 'DOCUMENT/MOVE_NODE',
            payload: { direction: 'down' },
        } as const;
        const col0 = 'cZcR';
        const adj = 'nvH_';
        const mov = 'nKUl';
        const root = 'rXVP';
        const input = {
            columns: [
                {
                    id: col0,
                    groups: [{ nodes: [adj, mov], parentId: root }],
                },
            ],
            state: {
                activeNode: mov,
            },
        };
        const output = {
            columns: [
                {
                    id: col0,
                    groups: [{ nodes: [adj, mov], parentId: root }],
                },
            ],
            state: {
                activeNode: mov,
            },
        };
        moveNode(input.columns, input.state, action);
        expect(input).toEqual(output);
    });
    test('1 >2 right', () => {
        const action = {
            type: 'DOCUMENT/MOVE_NODE',
            payload: { direction: 'right' },
        } as const;
        const col0 = 'cZcR';
        const mov = 'nKUl';
        const adj = 'nvH_';
        const root = 'rXVP';
        const input = {
            columns: [
                {
                    id: col0,
                    groups: [{ nodes: [adj, mov], parentId: root }],
                },
            ],
            state: {
                activeNode: mov,
            },
        };
        const col1 = 'cDb3';
        const output = {
            columns: [
                { id: col0, groups: [{ nodes: [adj], parentId: root }] },
                { id: col1, groups: [{ nodes: [mov], parentId: adj }] },
            ],
            state: {
                activeNode: mov,
            },
        };
        moveNode(input.columns, input.state, action);
        input.columns[1].id = col1;
        expect(input).toEqual(output);
    });
    test('1 | >2 left', () => {
        const action = {
            type: 'DOCUMENT/MOVE_NODE',
            payload: { direction: 'left' },
        } as const;
        const col0 = 'cZcR';
        const col1 = 'cDb3';
        const mov = 'nKUl';
        const adj = 'nvH_';
        const root = 'rXVP';
        const input = {
            columns: [
                { id: col0, groups: [{ nodes: [adj], parentId: root }] },
                { id: col1, groups: [{ nodes: [mov], parentId: adj }] },
            ],
            state: {
                activeNode: mov,
            },
        };
        const output = {
            columns: [
                {
                    id: col0,
                    groups: [{ nodes: [adj, mov], parentId: root }],
                },
            ],
            state: {
                activeNode: mov,
            },
        };
        moveNode(input.columns, input.state, action);
        expect(input).toEqual(output);
    });
    test('2 | >1 left', () => {
        const action = {
            type: 'DOCUMENT/MOVE_NODE',
            payload: { direction: 'left' },
        } as const;
        const col0 = 'cZcR';
        const col1 = 'ceQr';
        const mov = 'nvH_';
        const adj = 'nKUl';
        const root = 'rXVP';
        const input = {
            columns: [
                { id: col0, groups: [{ nodes: [adj], parentId: root }] },
                { id: col1, groups: [{ nodes: [mov], parentId: adj }] },
            ],
            state: {
                activeNode: mov,
            },
        };
        const output = {
            columns: [
                {
                    id: col0,
                    groups: [{ nodes: [adj, mov], parentId: root }],
                },
            ],
            state: {
                activeNode: mov,
            },
        };
        moveNode(input.columns, input.state, action);
        expect(input).toEqual(output);
    });
    test('>1|*|* 2|*|* down', () => {
        const action = {
            type: 'DOCUMENT/MOVE_NODE',
            payload: { direction: 'down' },
        } as const;
        const mov = 'nQ-X';
        const adj = 'nDVm';
        const col0 = 'cPy4';
        const col1 = 'c362';
        const col2 = 'c4dq';
        const root = 'rqXI';
        const mov_c1 = 'nCoJ';
        const mov_c2 = 'nPFV';
        const adj_c1 = 'nk7L';
        const adj_c2 = 'n84c';
        const mov_c1_c1 = 'nsZV';
        const mov_c1_c2 = 'n8oS';
        const mov_c2_c1 = 'nplq';
        const mov_c2_c2 = 'nnPq';
        const adj_c1_c1 = 'nuyE';
        const adj_c1_c2 = 'n4s5';
        const adj_c2_c1 = 'nDT_';
        const adj_c2_c2 = 'n4fu';
        const input = {
            columns: [
                {
                    id: col0,
                    groups: [{ nodes: [mov, adj], parentId: root }],
                },
                {
                    id: col1,
                    groups: [
                        { nodes: [mov_c1, mov_c2], parentId: mov },
                        { nodes: [adj_c1, adj_c2], parentId: adj },
                    ],
                },
                {
                    id: col2,
                    groups: [
                        { nodes: [mov_c1_c1, mov_c1_c2], parentId: mov_c1 },
                        { nodes: [mov_c2_c1, mov_c2_c2], parentId: mov_c2 },
                        { nodes: [adj_c1_c1, adj_c1_c2], parentId: adj_c1 },
                        { nodes: [adj_c2_c1, adj_c2_c2], parentId: adj_c2 },
                    ],
                },
            ],
            state: {
                activeNode: mov,
            },
        };
        const output = {
            columns: [
                {
                    id: col0,
                    groups: [{ nodes: [adj, mov], parentId: root }],
                },
                {
                    id: col1,
                    groups: [
                        { nodes: [adj_c1, adj_c2], parentId: adj },
                        { nodes: [mov_c1, mov_c2], parentId: mov },
                    ],
                },
                {
                    id: col2,
                    groups: [
                        { nodes: [adj_c1_c1, adj_c1_c2], parentId: adj_c1 },
                        { nodes: [adj_c2_c1, adj_c2_c2], parentId: adj_c2 },
                        { nodes: [mov_c1_c1, mov_c1_c2], parentId: mov_c1 },
                        { nodes: [mov_c2_c1, mov_c2_c2], parentId: mov_c2 },
                    ],
                },
            ],
            state: {
                activeNode: mov,
            },
        };
        moveNode(input.columns, input.state, action);
        expect(input).toEqual(output);
    });
    test('>1|*|* 2|*|* right', () => {
        const action = {
            type: 'DOCUMENT/MOVE_NODE',
            payload: { direction: 'right' },
        } as const;
        const mov = 'nQ-X';
        const adj = 'nDVm';
        const root = 'rqXI';
        const col0 = 'cPy4';
        const col1 = 'c362';
        const col2 = 'c4dq';
        const mov_1 = 'nCoJ';
        const mov_2 = 'nPFV';
        const adj_1 = 'nk7L';
        const adj_2 = 'n84c';
        const mov_1_1 = 'nsZV';
        const mov_1_2 = 'n8oS';
        const mov_2_1 = 'nplq';
        const mov_2_2 = 'nnPq';
        const adj_1_1 = 'nuyE';
        const adj_1_2 = 'n4s5';
        const adj_2_1 = 'nDT_';
        const adj_2_2 = 'n4fu';
        const input = {
            columns: [
                {
                    id: col0,
                    groups: [{ nodes: [mov, adj], parentId: root }],
                },
                {
                    id: col1,
                    groups: [
                        { nodes: [mov_1, mov_2], parentId: mov },
                        { nodes: [adj_1, adj_2], parentId: adj },
                    ],
                },
                {
                    id: col2,
                    groups: [
                        { nodes: [mov_1_1, mov_1_2], parentId: mov_1 },
                        { nodes: [mov_2_1, mov_2_2], parentId: mov_2 },
                        { nodes: [adj_1_1, adj_1_2], parentId: adj_1 },
                        { nodes: [adj_2_1, adj_2_2], parentId: adj_2 },
                    ],
                },
            ],
            state: {
                activeNode: mov,
            },
        };
        const col3 = 'cbQd';
        const output = {
            columns: [
                { id: col0, groups: [{ nodes: [adj], parentId: root }] },
                {
                    id: col1,
                    groups: [{ nodes: [adj_1, adj_2, mov], parentId: adj }],
                },
                {
                    id: col2,
                    groups: [
                        { nodes: [adj_1_1, adj_1_2], parentId: adj_1 },
                        { nodes: [adj_2_1, adj_2_2], parentId: adj_2 },
                        { nodes: [mov_1, mov_2], parentId: mov },
                    ],
                },
                {
                    id: col3,
                    groups: [
                        { nodes: [mov_1_1, mov_1_2], parentId: mov_1 },
                        { nodes: [mov_2_1, mov_2_2], parentId: mov_2 },
                    ],
                },
            ],
            state: {
                activeNode: mov,
            },
        };
        moveNode(input.columns, input.state, action);
        input.columns[3].id = col3;
        expect(input).toEqual(output);
    });
    test('>1|*|* 2|*|* left', () => {
        const action = {
            type: 'DOCUMENT/MOVE_NODE',
            payload: { direction: 'left' },
        } as const;
        const input = {
            columns: [
                {
                    id: 'cPy4',
                    groups: [{ nodes: ['nQ-X', 'nDVm'], parentId: 'rqXI' }],
                },
                {
                    id: 'c362',
                    groups: [
                        { nodes: ['nCoJ', 'nPFV'], parentId: 'nQ-X' },
                        { nodes: ['nk7L', 'n84c'], parentId: 'nDVm' },
                    ],
                },
                {
                    id: 'c4dq',
                    groups: [
                        { nodes: ['nsZV', 'n8oS'], parentId: 'nCoJ' },
                        { nodes: ['nplq', 'nnPq'], parentId: 'nPFV' },
                        { nodes: ['nuyE', 'n4s5'], parentId: 'nk7L' },
                        { nodes: ['nDT_', 'n4fu'], parentId: 'n84c' },
                    ],
                },
            ],
            state: {
                activeNode: 'nQ-X',
            },
        };
        const output = {
            columns: [
                {
                    id: 'cPy4',
                    groups: [{ nodes: ['nQ-X', 'nDVm'], parentId: 'rqXI' }],
                },
                {
                    id: 'c362',
                    groups: [
                        { nodes: ['nCoJ', 'nPFV'], parentId: 'nQ-X' },
                        { nodes: ['nk7L', 'n84c'], parentId: 'nDVm' },
                    ],
                },
                {
                    id: 'c4dq',
                    groups: [
                        { nodes: ['nsZV', 'n8oS'], parentId: 'nCoJ' },
                        { nodes: ['nplq', 'nnPq'], parentId: 'nPFV' },
                        { nodes: ['nuyE', 'n4s5'], parentId: 'nk7L' },
                        { nodes: ['nDT_', 'n4fu'], parentId: 'n84c' },
                    ],
                },
            ],
            state: {
                activeNode: 'nQ-X',
            },
        };
        moveNode(input.columns, input.state, action);
        expect(input).toEqual(output);
    });
    test('1|*|* >2|*|*  up', () => {
        const action = {
            type: 'DOCUMENT/MOVE_NODE',
            payload: { direction: 'up' },
        } as const;
        const input = {
            columns: [
                {
                    id: 'cPy4',
                    groups: [{ nodes: ['nQ-X', 'nDVm'], parentId: 'rqXI' }],
                },
                {
                    id: 'c362',
                    groups: [
                        { nodes: ['nCoJ', 'nPFV'], parentId: 'nQ-X' },
                        { nodes: ['nk7L', 'n84c'], parentId: 'nDVm' },
                    ],
                },
                {
                    id: 'c4dq',
                    groups: [
                        { nodes: ['nsZV', 'n8oS'], parentId: 'nCoJ' },
                        { nodes: ['nplq', 'nnPq'], parentId: 'nPFV' },
                        { nodes: ['nuyE', 'n4s5'], parentId: 'nk7L' },
                        { nodes: ['nDT_', 'n4fu'], parentId: 'n84c' },
                    ],
                },
            ],
            state: {
                activeNode: 'nDVm',
            },
        };
        const output = {
            columns: [
                {
                    id: 'cPy4',
                    groups: [{ nodes: ['nDVm', 'nQ-X'], parentId: 'rqXI' }],
                },
                {
                    id: 'c362',
                    groups: [
                        { nodes: ['nk7L', 'n84c'], parentId: 'nDVm' },
                        { nodes: ['nCoJ', 'nPFV'], parentId: 'nQ-X' },
                    ],
                },
                {
                    id: 'c4dq',
                    groups: [
                        { nodes: ['nuyE', 'n4s5'], parentId: 'nk7L' },
                        { nodes: ['nDT_', 'n4fu'], parentId: 'n84c' },
                        { nodes: ['nsZV', 'n8oS'], parentId: 'nCoJ' },
                        { nodes: ['nplq', 'nnPq'], parentId: 'nPFV' },
                    ],
                },
            ],
            state: {
                activeNode: 'nDVm',
            },
        };
        moveNode(input.columns, input.state, action);
        expect(input).toEqual(output);
    });
    test('1|*|* >2|*|*  right', () => {
        const action = {
            type: 'DOCUMENT/MOVE_NODE',
            payload: { direction: 'right' },
        } as const;
        const col0 = 'cPy4';
        const col1 = 'c362';
        const col2 = 'c4dq';
        const input = {
            columns: [
                {
                    id: col0,
                    groups: [{ nodes: ['nQ-X', 'nDVm'], parentId: 'rqXI' }],
                },
                {
                    id: col1,
                    groups: [
                        { nodes: ['nCoJ', 'nPFV'], parentId: 'nQ-X' },
                        { nodes: ['nk7L', 'n84c'], parentId: 'nDVm' },
                    ],
                },
                {
                    id: col2,
                    groups: [
                        { nodes: ['nsZV', 'n8oS'], parentId: 'nCoJ' },
                        { nodes: ['nplq', 'nnPq'], parentId: 'nPFV' },
                        { nodes: ['nuyE', 'n4s5'], parentId: 'nk7L' },
                        { nodes: ['nDT_', 'n4fu'], parentId: 'n84c' },
                    ],
                },
            ],
            state: {
                activeNode: 'nDVm',
            },
        };
        const col3 = 'c8Sb';
        const output = {
            columns: [
                { id: col0, groups: [{ nodes: ['nQ-X'], parentId: 'rqXI' }] },
                {
                    id: col1,
                    groups: [
                        { nodes: ['nCoJ', 'nPFV', 'nDVm'], parentId: 'nQ-X' },
                    ],
                },
                {
                    id: col2,
                    groups: [
                        { nodes: ['nsZV', 'n8oS'], parentId: 'nCoJ' },
                        { nodes: ['nplq', 'nnPq'], parentId: 'nPFV' },
                        { nodes: ['nk7L', 'n84c'], parentId: 'nDVm' },
                    ],
                },
                {
                    id: col3,
                    groups: [
                        { nodes: ['nuyE', 'n4s5'], parentId: 'nk7L' },
                        { nodes: ['nDT_', 'n4fu'], parentId: 'n84c' },
                    ],
                },
            ],
            state: {
                activeNode: 'nDVm',
            },
        };
        moveNode(input.columns, input.state, action);
        input.columns[3].id = col3;
        expect(input).toEqual(output);
    });
    test('1|*|* >2|*|*  down', () => {
        const action = {
            type: 'DOCUMENT/MOVE_NODE',
            payload: { direction: 'down' },
        } as const;
        const input = {
            columns: [
                {
                    id: 'cPy4',
                    groups: [{ nodes: ['nQ-X', 'nDVm'], parentId: 'rqXI' }],
                },
                {
                    id: 'c362',
                    groups: [
                        { nodes: ['nCoJ', 'nPFV'], parentId: 'nQ-X' },
                        { nodes: ['nk7L', 'n84c'], parentId: 'nDVm' },
                    ],
                },
                {
                    id: 'c4dq',
                    groups: [
                        { nodes: ['nsZV', 'n8oS'], parentId: 'nCoJ' },
                        { nodes: ['nplq', 'nnPq'], parentId: 'nPFV' },
                        { nodes: ['nuyE', 'n4s5'], parentId: 'nk7L' },
                        { nodes: ['nDT_', 'n4fu'], parentId: 'n84c' },
                    ],
                },
            ],
            state: {
                activeNode: 'nDVm',
            },
        };
        const output = {
            columns: [
                {
                    id: 'cPy4',
                    groups: [{ nodes: ['nQ-X', 'nDVm'], parentId: 'rqXI' }],
                },
                {
                    id: 'c362',
                    groups: [
                        { nodes: ['nCoJ', 'nPFV'], parentId: 'nQ-X' },
                        { nodes: ['nk7L', 'n84c'], parentId: 'nDVm' },
                    ],
                },
                {
                    id: 'c4dq',
                    groups: [
                        { nodes: ['nsZV', 'n8oS'], parentId: 'nCoJ' },
                        { nodes: ['nplq', 'nnPq'], parentId: 'nPFV' },
                        { nodes: ['nuyE', 'n4s5'], parentId: 'nk7L' },
                        { nodes: ['nDT_', 'n4fu'], parentId: 'n84c' },
                    ],
                },
            ],
            state: {
                activeNode: 'nDVm',
            },
        };
        moveNode(input.columns, input.state, action);
        expect(input).toEqual(output);
    });
    test('>*|1|* *|2|* down', () => {
        const action = {
            type: 'DOCUMENT/MOVE_NODE',
            payload: { direction: 'down' },
        } as const;
        const input = {
            columns: [
                {
                    id: 'cPy4',
                    groups: [{ nodes: ['nQ-X', 'nDVm'], parentId: 'rqXI' }],
                },
                {
                    id: 'c362',
                    groups: [
                        { nodes: ['nCoJ', 'nPFV'], parentId: 'nQ-X' },
                        { nodes: ['nk7L', 'n84c'], parentId: 'nDVm' },
                    ],
                },
                {
                    id: 'c4dq',
                    groups: [
                        { nodes: ['nsZV', 'n8oS'], parentId: 'nCoJ' },
                        { nodes: ['nplq', 'nnPq'], parentId: 'nPFV' },
                        { nodes: ['nuyE'], parentId: 'nk7L' },
                        { nodes: ['nDT_', 'n4fu'], parentId: 'n84c' },
                    ],
                },
            ],
            state: {
                activeNode: 'nCoJ',
            },
        };
        const output = {
            columns: [
                {
                    id: 'cPy4',
                    groups: [{ nodes: ['nQ-X', 'nDVm'], parentId: 'rqXI' }],
                },
                {
                    id: 'c362',
                    groups: [
                        { nodes: ['nPFV', 'nCoJ'], parentId: 'nQ-X' },
                        { nodes: ['nk7L', 'n84c'], parentId: 'nDVm' },
                    ],
                },
                {
                    id: 'c4dq',
                    groups: [
                        { nodes: ['nplq', 'nnPq'], parentId: 'nPFV' },
                        { nodes: ['nsZV', 'n8oS'], parentId: 'nCoJ' },
                        { nodes: ['nuyE'], parentId: 'nk7L' },
                        { nodes: ['nDT_', 'n4fu'], parentId: 'n84c' },
                    ],
                },
            ],
            state: {
                activeNode: 'nCoJ',
            },
        };
        moveNode(input.columns, input.state, action);
        expect(input).toEqual(output);
    });
    test('>*|1|* *|2|* right', () => {
        const action = {
            type: 'DOCUMENT/MOVE_NODE',
            payload: { direction: 'right' },
        } as const;
        const col0 = 'cPy4';
        const col1 = 'c362';
        const col2 = 'c4dq';
        const input = {
            columns: [
                {
                    id: col0,
                    groups: [{ nodes: ['nQ-X', 'nDVm'], parentId: 'rqXI' }],
                },
                {
                    id: col1,
                    groups: [
                        { nodes: ['nCoJ', 'nPFV'], parentId: 'nQ-X' },
                        { nodes: ['nk7L', 'n84c'], parentId: 'nDVm' },
                    ],
                },
                {
                    id: col2,
                    groups: [
                        { nodes: ['nsZV', 'n8oS'], parentId: 'nCoJ' },
                        { nodes: ['nplq', 'nnPq'], parentId: 'nPFV' },
                        { nodes: ['nuyE'], parentId: 'nk7L' },
                        { nodes: ['nDT_', 'n4fu'], parentId: 'n84c' },
                    ],
                },
            ],
            state: {
                activeNode: 'nPFV',
            },
        };
        const col3 = 'cHDY';
        const output = {
            columns: [
                {
                    id: col0,
                    groups: [{ nodes: ['nQ-X', 'nDVm'], parentId: 'rqXI' }],
                },
                {
                    id: col1,
                    groups: [
                        { nodes: ['nCoJ'], parentId: 'nQ-X' },
                        { nodes: ['nk7L', 'n84c'], parentId: 'nDVm' },
                    ],
                },
                {
                    id: col2,
                    groups: [
                        { nodes: ['nsZV', 'n8oS', 'nPFV'], parentId: 'nCoJ' },
                        { nodes: ['nuyE'], parentId: 'nk7L' },
                        { nodes: ['nDT_', 'n4fu'], parentId: 'n84c' },
                    ],
                },
                {
                    id: col3,
                    groups: [{ nodes: ['nplq', 'nnPq'], parentId: 'nPFV' }],
                },
            ],
            state: {
                activeNode: 'nPFV',
            },
        };
        moveNode(input.columns, input.state, action);
        input.columns[3].id = col3;
        expect(input).toEqual(output);
    });
    test('>*|1|* *|2|* up', () => {
        const action = {
            type: 'DOCUMENT/MOVE_NODE',
            payload: { direction: 'up' },
        } as const;
        const input = {
            columns: [
                {
                    id: 'cPy4',
                    groups: [{ nodes: ['nQ-X', 'nDVm'], parentId: 'rqXI' }],
                },
                {
                    id: 'c362',
                    groups: [
                        { nodes: ['nCoJ', 'nPFV'], parentId: 'nQ-X' },
                        { nodes: ['nk7L', 'n84c'], parentId: 'nDVm' },
                    ],
                },
                {
                    id: 'c4dq',
                    groups: [
                        { nodes: ['nsZV', 'n8oS'], parentId: 'nCoJ' },
                        { nodes: ['nplq', 'nnPq'], parentId: 'nPFV' },
                        { nodes: ['nuyE'], parentId: 'nk7L' },
                        { nodes: ['nDT_', 'n4fu'], parentId: 'n84c' },
                    ],
                },
            ],
            state: {
                activeNode: 'nPFV',
            },
        };
        const output = {
            columns: [
                {
                    id: 'cPy4',
                    groups: [{ nodes: ['nQ-X', 'nDVm'], parentId: 'rqXI' }],
                },
                {
                    id: 'c362',
                    groups: [
                        { nodes: ['nPFV', 'nCoJ'], parentId: 'nQ-X' },
                        { nodes: ['nk7L', 'n84c'], parentId: 'nDVm' },
                    ],
                },
                {
                    id: 'c4dq',
                    groups: [
                        { nodes: ['nplq', 'nnPq'], parentId: 'nPFV' },
                        { nodes: ['nsZV', 'n8oS'], parentId: 'nCoJ' },
                        { nodes: ['nuyE'], parentId: 'nk7L' },
                        { nodes: ['nDT_', 'n4fu'], parentId: 'n84c' },
                    ],
                },
            ],
            state: {
                activeNode: 'nPFV',
            },
        };
        moveNode(input.columns, input.state, action);
        expect(input).toEqual(output);
    });
    test('>*|1|* *|2|* left', () => {
        const action = {
            type: 'DOCUMENT/MOVE_NODE',
            payload: { direction: 'left' },
        } as const;
        const input = {
            columns: [
                {
                    id: 'c-we',
                    groups: [{ nodes: ['nsdN', 'n4h_'], parentId: 'roiv' }],
                },
                {
                    id: 'c_V-',
                    groups: [
                        { nodes: ['nliN', 'nyrI'], parentId: 'nsdN' },
                        { nodes: ['nj09', 'nYBQ'], parentId: 'n4h_' },
                    ],
                },
                {
                    id: 'cvaf',
                    groups: [
                        { nodes: ['nnDy', 'nmsC'], parentId: 'nliN' },
                        { nodes: ['nd_n', 'n8RE'], parentId: 'nyrI' },
                        { nodes: ['nf0o', 'ndgL'], parentId: 'nj09' },
                        { nodes: ['n-nt', 'nN3P'], parentId: 'nYBQ' },
                    ],
                },
            ],
            state: {
                activeNode: 'nyrI',
            },
        };
        const output = {
            columns: [
                {
                    id: 'c-we',
                    groups: [
                        { nodes: ['nsdN', 'nyrI', 'n4h_'], parentId: 'roiv' },
                    ],
                },
                {
                    id: 'c_V-',
                    groups: [
                        { nodes: ['nliN'], parentId: 'nsdN' },
                        { nodes: ['nd_n', 'n8RE'], parentId: 'nyrI' },
                        { nodes: ['nj09', 'nYBQ'], parentId: 'n4h_' },
                    ],
                },
                {
                    id: 'cvaf',
                    groups: [
                        { nodes: ['nnDy', 'nmsC'], parentId: 'nliN' },
                        { nodes: ['nf0o', 'ndgL'], parentId: 'nj09' },
                        { nodes: ['n-nt', 'nN3P'], parentId: 'nYBQ' },
                    ],
                },
            ],
            state: {
                activeNode: 'nyrI',
            },
        };
        moveNode(input.columns, input.state, action);
        expect(input).toEqual(output);
    });
    test('*|1|* >*|2|* up', () => {
        const action = {
            type: 'DOCUMENT/MOVE_NODE',
            payload: { direction: 'up' },
        } as const;
        const input = {
            columns: [
                {
                    id: 'ckbr',
                    groups: [{ nodes: ['nqo0', 'nJEa'], parentId: 'rEOB' }],
                },
                {
                    id: 'cN6E',
                    groups: [
                        { nodes: ['nzBV', 'ndry'], parentId: 'nqo0' },
                        { nodes: ['nBcR', 'npu3'], parentId: 'nJEa' },
                    ],
                },
                {
                    id: 'cVnd',
                    groups: [
                        { nodes: ['nnDF', 'np8A'], parentId: 'nzBV' },
                        { nodes: ['nio9', 'nX-M'], parentId: 'ndry' },
                        { nodes: ['nwri', 'nQ8W'], parentId: 'nBcR' },
                        { nodes: ['n2fS', 'nTXF'], parentId: 'npu3' },
                    ],
                },
            ],
            state: {
                activeNode: 'nBcR',
            },
        };
        const output = {
            columns: [
                {
                    id: 'ckbr',
                    groups: [{ nodes: ['nqo0', 'nJEa'], parentId: 'rEOB' }],
                },
                {
                    id: 'cN6E',
                    groups: [
                        { nodes: ['nzBV', 'nBcR', 'ndry'], parentId: 'nqo0' },
                        { nodes: ['npu3'], parentId: 'nJEa' },
                    ],
                },
                {
                    id: 'cVnd',
                    groups: [
                        { nodes: ['nnDF', 'np8A'], parentId: 'nzBV' },
                        { nodes: ['nwri', 'nQ8W'], parentId: 'nBcR' },
                        { nodes: ['nio9', 'nX-M'], parentId: 'ndry' },
                        { nodes: ['n2fS', 'nTXF'], parentId: 'npu3' },
                    ],
                },
            ],
            state: {
                activeNode: 'nBcR',
            },
        };
        moveNode(input.columns, input.state, action);
        expect(input).toEqual(output);
    });
    test('*|1|* >*|2|* down', () => {
        const action = {
            type: 'DOCUMENT/MOVE_NODE',
            payload: { direction: 'down' },
        } as const;
        const input = {
            columns: [
                {
                    id: 'cQDQ',
                    groups: [{ nodes: ['nJae', 'nIKd'], parentId: 'rR3q' }],
                },
                {
                    id: 'cuf2',
                    groups: [
                        { nodes: ['nuIH', 'nr81'], parentId: 'nJae' },
                        { nodes: ['nJQr', 'n5GS'], parentId: 'nIKd' },
                    ],
                },
                {
                    id: 'ckBJ',
                    groups: [
                        { nodes: ['n-6-', 'nqu1'], parentId: 'nuIH' },
                        { nodes: ['nAaz', 'nryn'], parentId: 'nr81' },
                        { nodes: ['nNXP', 'njhg'], parentId: 'nJQr' },
                        { nodes: ['nEZv', 'n6wS'], parentId: 'n5GS' },
                    ],
                },
            ],
            state: {
                activeNode: 'nJQr',
            },
        };
        const output = {
            columns: [
                {
                    id: 'cQDQ',
                    groups: [{ nodes: ['nJae', 'nIKd'], parentId: 'rR3q' }],
                },
                {
                    id: 'cuf2',
                    groups: [
                        { nodes: ['nuIH', 'nr81'], parentId: 'nJae' },
                        { nodes: ['n5GS', 'nJQr'], parentId: 'nIKd' },
                    ],
                },
                {
                    id: 'ckBJ',
                    groups: [
                        { nodes: ['n-6-', 'nqu1'], parentId: 'nuIH' },
                        { nodes: ['nAaz', 'nryn'], parentId: 'nr81' },
                        { nodes: ['nEZv', 'n6wS'], parentId: 'n5GS' },
                        { nodes: ['nNXP', 'njhg'], parentId: 'nJQr' },
                    ],
                },
            ],
            state: {
                activeNode: 'nJQr',
            },
        };
        moveNode(input.columns, input.state, action);
        expect(input).toEqual(output);
    });
    test('*|1|* >*|2|* right', () => {
        const action = {
            type: 'DOCUMENT/MOVE_NODE',
            payload: { direction: 'right' },
        } as const;
        const col0 = 'cfMV';
        const col1 = 'cHzC';
        const col2 = 'cNRG';
        const input = {
            columns: [
                {
                    id: col0,
                    groups: [{ nodes: ['neHE', 'n42q'], parentId: 'rVHp' }],
                },
                {
                    id: col1,
                    groups: [
                        { nodes: ['nUcm', 'nqdD'], parentId: 'neHE' },
                        { nodes: ['n5JK', 'n_D6'], parentId: 'n42q' },
                    ],
                },
                {
                    id: col2,
                    groups: [
                        { nodes: ['n_DG', 'nITI'], parentId: 'nUcm' },
                        { nodes: ['nwUp', 'njV2'], parentId: 'nqdD' },
                        { nodes: ['n1If', 'nACn'], parentId: 'n5JK' },
                        { nodes: ['n-EP', 'nNN0'], parentId: 'n_D6' },
                    ],
                },
            ],
            state: {
                activeNode: 'n5JK',
            },
        };
        const col3 = 'cF6B';
        const output = {
            columns: [
                {
                    id: col0,
                    groups: [{ nodes: ['neHE', 'n42q'], parentId: 'rVHp' }],
                },
                {
                    id: col1,
                    groups: [
                        { nodes: ['nUcm', 'nqdD'], parentId: 'neHE' },
                        { nodes: ['n_D6'], parentId: 'n42q' },
                    ],
                },
                {
                    id: col2,
                    groups: [
                        { nodes: ['n_DG', 'nITI'], parentId: 'nUcm' },
                        { nodes: ['nwUp', 'njV2', 'n5JK'], parentId: 'nqdD' },
                        { nodes: ['n-EP', 'nNN0'], parentId: 'n_D6' },
                    ],
                },
                {
                    id: col3,
                    groups: [{ nodes: ['n1If', 'nACn'], parentId: 'n5JK' }],
                },
            ],
            state: {
                activeNode: 'n5JK',
            },
        };
        moveNode(input.columns, input.state, action);
        input.columns[3].id = col3;
        expect(input).toEqual(output);
    });
    test('*|1|* >*|2|* left', () => {
        const action = {
            type: 'DOCUMENT/MOVE_NODE',
            payload: { direction: 'left' },
        } as const;
        const input = {
            columns: [
                {
                    id: 'cGDX',
                    groups: [{ nodes: ['niYL', 'nW-U'], parentId: 'rEFa' }],
                },
                {
                    id: 'cPKc',
                    groups: [
                        { nodes: ['ndZj', 'nf1i'], parentId: 'niYL' },
                        { nodes: ['nrgT'], parentId: 'nW-U' },
                    ],
                },
                {
                    id: 'cjwL',
                    groups: [
                        { nodes: ['n1SV', 'nCTg'], parentId: 'ndZj' },
                        { nodes: ['n1aq', 'n-X2', 'nsYt'], parentId: 'nf1i' },
                        { nodes: ['nj_O', 'nXVQ'], parentId: 'nrgT' },
                    ],
                },
                {
                    id: 'ck_O',
                    groups: [{ nodes: ['ncev', 'nsqC'], parentId: 'nsYt' }],
                },
            ],
            state: {
                activeNode: 'nsYt',
            },
        };
        const output = {
            columns: [
                {
                    id: 'cGDX',
                    groups: [{ nodes: ['niYL', 'nW-U'], parentId: 'rEFa' }],
                },
                {
                    id: 'cPKc',
                    groups: [
                        { nodes: ['ndZj', 'nf1i', 'nsYt'], parentId: 'niYL' },
                        { nodes: ['nrgT'], parentId: 'nW-U' },
                    ],
                },
                {
                    id: 'cjwL',
                    groups: [
                        { nodes: ['n1SV', 'nCTg'], parentId: 'ndZj' },
                        { nodes: ['n1aq', 'n-X2'], parentId: 'nf1i' },
                        { nodes: ['ncev', 'nsqC'], parentId: 'nsYt' },
                        { nodes: ['nj_O', 'nXVQ'], parentId: 'nrgT' },
                    ],
                },
            ],
            state: {
                activeNode: 'nsYt',
            },
        };
        moveNode(input.columns, input.state, action);
        expect(input).toEqual(output);
    });
});
