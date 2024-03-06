import { dropNode } from 'src/stores/view/reducers/document/structure/drop-node/drop-node';
import { describe, expect, test } from 'vitest';

describe('drop-node', () => {
    test('2 below 1', () => {
        const dropped = 'no2W';
        const dropped_parent = 'rQSJ';
        const target = 'nUBq';
        const input = {
            columns: [
                {
                    id: 'cfcy',
                    groups: [
                        { nodes: [target, dropped], parentId: dropped_parent },
                    ],
                },
            ],
            state: {
                activeNode: dropped,
            },
        };
        const action = {
            type: 'DOCUMENT/DROP_NODE',
            payload: {
                droppedNodeId: dropped,
                targetNodeId: target,
                position: 'down',
            },
        } as const;
        const output = {
            columns: [
                {
                    id: 'cfcy',
                    groups: [
                        { nodes: [target, dropped], parentId: dropped_parent },
                    ],
                },
            ],
            state: {
                activeNode: dropped,
            },
        };
        dropNode(input.columns, input.state, action);
        expect(input.columns).toEqual(output.columns);
        expect(output.state).toEqual(output.state);
    });
    test('2 above 1', () => {
        const dropped = 'no2W';
        const dropped_parent = 'rQSJ';
        const target = 'nUBq';
        const input = {
            columns: [
                {
                    id: 'cfcy',
                    groups: [
                        { nodes: [target, dropped], parentId: dropped_parent },
                    ],
                },
            ],
            state: {
                activeNode: dropped,
            },
        };
        const action = {
            type: 'DOCUMENT/DROP_NODE',
            payload: {
                droppedNodeId: dropped,
                targetNodeId: target,
                position: 'up',
            },
        } as const;
        const output = {
            columns: [
                {
                    id: 'cfcy',
                    groups: [
                        { nodes: [dropped, target], parentId: dropped_parent },
                    ],
                },
            ],
            state: {
                activeNode: dropped,
            },
        };
        dropNode(input.columns, input.state, action);
        expect(input.columns).toEqual(output.columns);
        expect(output.state).toEqual(output.state);
    });
    test('1 under 2', () => {
        const dropped = 'nvEX';
        const target = 'nzJX';
        const action = {
            type: 'DOCUMENT/DROP_NODE',
            payload: {
                droppedNodeId: dropped,
                targetNodeId: target,
                position: 'down',
            },
        } as const;
        const parent_of_dropped = 'rA4k';
        const input = {
            columns: [
                {
                    id: 'cQGK',
                    groups: [
                        {
                            nodes: [dropped, target],
                            parentId: parent_of_dropped,
                        },
                    ],
                },
            ],
            state: {
                activeNode: dropped,
            },
        };
        const output = {
            columns: [
                {
                    id: 'cQGK',
                    groups: [
                        {
                            nodes: [target, dropped],
                            parentId: parent_of_dropped,
                        },
                    ],
                },
            ],
            state: {
                activeNode: dropped,
            },
        };
        dropNode(input.columns, input.state, action);
        expect(input.columns).toEqual(output.columns);
        expect(output.state).toEqual(output.state);
    });
    test('2 right to 1', () => {
        const dropped = 'nYx7';
        const target = 'nDps';
        const parent_of_dropped = 'r9sy';

        const action = {
            type: 'DOCUMENT/DROP_NODE',
            payload: {
                droppedNodeId: dropped,
                targetNodeId: target,
                position: 'right',
            },
        } as const;

        const column_1 = 'culg';
        const input = {
            columns: [
                {
                    id: column_1,
                    groups: [
                        {
                            nodes: [target, dropped],
                            parentId: parent_of_dropped,
                        },
                    ],
                },
            ],
            state: {
                activeNode: dropped,
            },
        };
        const column_2 = 'c5xD';
        const output = {
            columns: [
                {
                    id: column_1,
                    groups: [{ nodes: [target], parentId: parent_of_dropped }],
                },
                {
                    id: column_2,
                    groups: [{ nodes: [dropped], parentId: target }],
                },
            ],
            state: {
                activeNode: dropped,
            },
        };
        dropNode(input.columns, input.state, action);
        input.columns[1].id = column_2;
        expect(input.columns).toEqual(output.columns);
        expect(output.state).toEqual(output.state);
    });
    test('2* above 1*', () => {
        const dropped = 'nJus';
        const target = 'niZu';
        const action = {
            type: 'DOCUMENT/DROP_NODE',
            payload: {
                droppedNodeId: dropped,
                targetNodeId: target,
                position: 'up',
            },
        } as const;
        const parent_of_dropped = 'rUmf';
        const children_of_target = ['n8LQ', 'njnD'];
        const children_of_dropped = ['nzPw', 'nbpz'];
        const input = {
            columns: [
                {
                    id: 'cq-M',
                    groups: [
                        {
                            nodes: [target, dropped],
                            parentId: parent_of_dropped,
                        },
                    ],
                },
                {
                    id: 'c4Xj',
                    groups: [
                        { nodes: children_of_target, parentId: target },
                        { nodes: children_of_dropped, parentId: dropped },
                    ],
                },
            ],
            state: {
                activeNode: dropped,
            },
        };
        const output = {
            columns: [
                {
                    id: 'cq-M',
                    groups: [
                        {
                            nodes: [dropped, target],
                            parentId: parent_of_dropped,
                        },
                    ],
                },
                {
                    id: 'c4Xj',
                    groups: [
                        { nodes: children_of_dropped, parentId: dropped },
                        { nodes: children_of_target, parentId: target },
                    ],
                },
            ],
            state: {
                activeNode: dropped,
            },
        };
        dropNode(input.columns, input.state, action);
        expect(input.columns).toEqual(output.columns);
        expect(output.state).toEqual(output.state);
    });
    test('1* under 2*', () => {
        const dropped = 'np-B';
        const target = 'nj-O';
        const action = {
            type: 'DOCUMENT/DROP_NODE',
            payload: {
                droppedNodeId: dropped,
                targetNodeId: target,
                position: 'down',
            },
        } as const;
        const parent_of_dropped = 'rAos';
        const children_of_dropped = ['nio5', 'n6G1'];
        const children_of_target = ['nZnz', 'nEL_'];
        const input = {
            columns: [
                {
                    id: 'cwix',
                    groups: [
                        {
                            nodes: [dropped, target],
                            parentId: parent_of_dropped,
                        },
                    ],
                },
                {
                    id: 'ckRN',
                    groups: [
                        { nodes: children_of_dropped, parentId: dropped },
                        { nodes: children_of_target, parentId: target },
                    ],
                },
            ],
            state: {
                activeNode: dropped,
            },
        };
        const output = {
            columns: [
                {
                    id: 'cwix',
                    groups: [
                        {
                            nodes: [target, dropped],
                            parentId: parent_of_dropped,
                        },
                    ],
                },
                {
                    id: 'ckRN',
                    groups: [
                        { nodes: children_of_target, parentId: target },
                        { nodes: children_of_dropped, parentId: dropped },
                    ],
                },
            ],
            state: {
                activeNode: dropped,
            },
        };
        dropNode(input.columns, input.state, action);
        expect(input.columns).toEqual(output.columns);
        expect(output.state).toEqual(output.state);
    });
    test('2* right to 1*', () => {
        const dropped = 'npzs';
        const target = 'nU9f';
        const action = {
            type: 'DOCUMENT/DROP_NODE',
            payload: {
                droppedNodeId: dropped,
                targetNodeId: target,
                position: 'right',
            },
        } as const;
        const parent_of_dropped = 'rdrI';
        const child_of_target_1 = 'nHk6';
        const child_of_target_2 = 'njqs';
        const child_of_dropped_1 = 'nOAN';
        const child_of_dropped_2 = 'n5te';
        const input = {
            columns: [
                {
                    id: 'cG2c',
                    groups: [
                        {
                            nodes: [target, dropped],
                            parentId: parent_of_dropped,
                        },
                    ],
                },
                {
                    id: 'caBg',
                    groups: [
                        {
                            nodes: [child_of_target_1, child_of_target_2],
                            parentId: target,
                        },
                        {
                            nodes: [child_of_dropped_1, child_of_dropped_2],
                            parentId: dropped,
                        },
                    ],
                },
            ],
            state: {
                activeNode: dropped,
            },
        };
        const created_column_id = 'column_1';
        const output = {
            columns: [
                {
                    id: 'cG2c',
                    groups: [{ nodes: [target], parentId: parent_of_dropped }],
                },
                {
                    id: 'caBg',
                    groups: [
                        {
                            nodes: [
                                child_of_target_1,
                                child_of_target_2,
                                dropped,
                            ],
                            parentId: target,
                        },
                    ],
                },
                {
                    id: created_column_id,
                    groups: [
                        {
                            nodes: [child_of_dropped_1, child_of_dropped_2],
                            parentId: dropped,
                        },
                    ],
                },
            ],
            state: {
                activeNode: dropped,
            },
        };
        dropNode(input.columns, input.state, action);
        input.columns[2].id = created_column_id;
        expect(input.columns).toEqual(output.columns);
        expect(output.state).toEqual(output.state);
    });
    test('1* right to 2*', () => {
        const dropped = 'nOq7';
        const target = 'nBRR';
        const action = {
            type: 'DOCUMENT/DROP_NODE',
            payload: {
                droppedNodeId: dropped,
                targetNodeId: target,
                position: 'right',
            },
        } as const;
        const parent_of_dropped = 'rck5';
        const child_of_dropped_1 = 'nYS6';
        const child_of_dropped_2 = 'niGp';
        const child_of_target_1 = 'nbvD';
        const child_of_target_2 = 'nXUX';
        const column_1 = 'cVS4';
        const column_2 = 'cgIw';
        const input = {
            columns: [
                {
                    id: column_1,
                    groups: [
                        {
                            nodes: [dropped, target],
                            parentId: parent_of_dropped,
                        },
                    ],
                },
                {
                    id: column_2,
                    groups: [
                        {
                            nodes: [child_of_dropped_1, child_of_dropped_2],
                            parentId: dropped,
                        },
                        {
                            nodes: [child_of_target_1, child_of_target_2],
                            parentId: target,
                        },
                    ],
                },
            ],
            state: {
                activeNode: dropped,
            },
        };
        const column_3 = 'cXd6';
        const output = {
            columns: [
                {
                    id: column_1,
                    groups: [{ nodes: [target], parentId: parent_of_dropped }],
                },
                {
                    id: column_2,
                    groups: [
                        {
                            nodes: [
                                child_of_target_1,
                                child_of_target_2,
                                dropped,
                            ],
                            parentId: target,
                        },
                    ],
                },
                {
                    id: column_3,
                    groups: [
                        {
                            nodes: [child_of_dropped_1, child_of_dropped_2],
                            parentId: dropped,
                        },
                    ],
                },
            ],
            state: {
                activeNode: dropped,
            },
        };

        dropNode(input.columns, input.state, action);
        input.columns[2].id = column_3;
        expect(input.columns).toEqual(output.columns);
        expect(output.state).toEqual(output.state);
    });
    test('1** under 2**', () => {
        const dropped = 'nhWo';
        const target = 'ni7w';
        const action = {
            type: 'DOCUMENT/DROP_NODE',
            payload: {
                droppedNodeId: dropped,
                targetNodeId: target,
                position: 'down',
            },
        } as const;
        const column_1 = 'cAth';
        const column_2 = 'cmGX';
        const drop_c1 = 'nKgW';
        const drop_c2 = 'ntpR';
        const targ_c1 = 'n1Y5';
        const targ_c2 = 'ndFH';
        const drop_c1_c1 = 'n3Nw';
        const drop_c1_c2 = 'ng9C';
        const drop_c2_c1 = 'nCV_';
        const drop_c2_c2 = 'n2Zw';
        const targ_c1_c1 = 'nahz';
        const targ_c1_c2 = 'nSdM';
        const targ_c2_c1 = 'nJbC';
        const targ_c2_c2 = 'nk7m';
        const column_3 = 'coS6';
        const input = {
            columns: [
                {
                    id: column_1,
                    groups: [{ nodes: [dropped, target], parentId: 'rwGc' }],
                },
                {
                    id: column_2,
                    groups: [
                        { nodes: [drop_c1, drop_c2], parentId: dropped },
                        { nodes: [targ_c1, targ_c2], parentId: target },
                    ],
                },
                {
                    id: column_3,
                    groups: [
                        {
                            nodes: [drop_c1_c1, drop_c1_c2],
                            parentId: drop_c1,
                        },
                        {
                            nodes: [drop_c2_c1, drop_c2_c2],
                            parentId: drop_c2,
                        },
                        {
                            nodes: [targ_c1_c1, targ_c1_c2],
                            parentId: targ_c1,
                        },
                        {
                            nodes: [targ_c2_c1, targ_c2_c2],
                            parentId: targ_c2,
                        },
                    ],
                },
            ],
            state: {
                activeNode: dropped,
            },
        };
        const output = {
            columns: [
                {
                    id: column_1,
                    groups: [{ nodes: [target, dropped], parentId: 'rwGc' }],
                },
                {
                    id: column_2,
                    groups: [
                        { nodes: [targ_c1, targ_c2], parentId: target },
                        { nodes: [drop_c1, drop_c2], parentId: dropped },
                    ],
                },
                {
                    id: column_3,
                    groups: [
                        {
                            nodes: [targ_c1_c1, targ_c1_c2],
                            parentId: targ_c1,
                        },
                        {
                            nodes: [targ_c2_c1, targ_c2_c2],
                            parentId: targ_c2,
                        },
                        {
                            nodes: [drop_c1_c1, drop_c1_c2],
                            parentId: drop_c1,
                        },
                        {
                            nodes: [drop_c2_c1, drop_c2_c2],
                            parentId: drop_c2,
                        },
                    ],
                },
            ],
            state: {
                activeNode: dropped,
            },
        };
        dropNode(input.columns, input.state, action);
        expect(input.columns).toEqual(output.columns);
        expect(output.state).toEqual(output.state);
    });
    test('2** under 1**', () => {
        const dro = 'nzyU';
        const tar = 'nq51';
        const root = 'rD3B';
        const tar_c1 = 'nwST';
        const tar_c2 = 'nGz6';
        const dro_c1 = 'n5lJ';
        const dro_c2 = 'n3Pu';
        const tar_c1_c1 = 'nebp';
        const tar_c1_c2 = 'ntMC';
        const tar_c2_c1 = 'nO2r';
        const tar_c2_c2 = 'nKOf';
        const dro_c1_c1 = 'nfBR';
        const dro_c1_c2 = 'nVpA';
        const dro_c2_c1 = 'ntDR';
        const dro_c2_c2 = 'n78W';
        const col_1 = 'cZVS';
        const col_2 = 'c_sC';
        const col_3 = 'cSQX';
        const action = {
            type: 'DOCUMENT/DROP_NODE',
            payload: {
                droppedNodeId: dro,
                targetNodeId: tar,
                position: 'up',
            },
        } as const;
        const input = {
            columns: [
                {
                    id: col_1,
                    groups: [{ nodes: [tar, dro], parentId: root }],
                },
                {
                    id: col_2,
                    groups: [
                        { nodes: [tar_c1, tar_c2], parentId: tar },
                        { nodes: [dro_c1, dro_c2], parentId: dro },
                    ],
                },
                {
                    id: col_3,
                    groups: [
                        { nodes: [tar_c1_c1, tar_c1_c2], parentId: tar_c1 },
                        { nodes: [tar_c2_c1, tar_c2_c2], parentId: tar_c2 },
                        { nodes: [dro_c1_c1, dro_c1_c2], parentId: dro_c1 },
                        { nodes: [dro_c2_c1, dro_c2_c2], parentId: dro_c2 },
                    ],
                },
            ],
            state: {
                activeNode: dro,
            },
        };
        const output = {
            columns: [
                {
                    id: col_1,
                    groups: [{ nodes: [dro, tar], parentId: root }],
                },
                {
                    id: col_2,
                    groups: [
                        { nodes: [dro_c1, dro_c2], parentId: dro },
                        { nodes: [tar_c1, tar_c2], parentId: tar },
                    ],
                },
                {
                    id: col_3,
                    groups: [
                        { nodes: [dro_c1_c1, dro_c1_c2], parentId: dro_c1 },
                        { nodes: [dro_c2_c1, dro_c2_c2], parentId: dro_c2 },
                        { nodes: [tar_c1_c1, tar_c1_c2], parentId: tar_c1 },
                        { nodes: [tar_c2_c1, tar_c2_c2], parentId: tar_c2 },
                    ],
                },
            ],
            state: {
                activeNode: dro,
            },
        };
        dropNode(input.columns, input.state, action);
        expect(input.columns).toEqual(output.columns);
        expect(output.state).toEqual(output.state);
    });
    test('1*** right to 2***', () => {
        const dro = 'neOB';
        const tar = 'nS2V';
        const action = {
            type: 'DOCUMENT/DROP_NODE',
            payload: {
                droppedNodeId: dro,
                targetNodeId: tar,
                position: 'right',
            },
        } as const;
        const col1 = 'cS5m';
        const col2 = 'cuoX';
        const root = 'rZib';
        const dro_c1 = 'nDuK';
        const dro_c2 = 'nw_O';
        const tar_c1 = 'npRI';
        const tar_c2 = 'nZTH';
        const col3 = 'ckel';
        const dro_c1_c1 = 'nWm-';
        const dro_c1_c2 = 'nqau';
        const dro_c2_c1 = 'nlvy';
        const dro_c2_c2 = 'n6RD';
        const tar_c1_c1 = 'nmLC';
        const tar_c1_c2 = 'n080';
        const tar_c2_c1 = 'nHfb';
        const tar_c2_c2 = 'ntJA';
        const dro_c1_c1_c1 = 'nTXB';
        const dro_c2_c1_c1 = 'nTZq';
        const tar_c1_c1_c1 = 'nYZV';
        const tar_c2_c1_c1 = 'npAN';
        const col4 = 'cmo2';
        const input = {
            columns: [
                {
                    id: col1,
                    groups: [{ nodes: [dro, tar], parentId: root }],
                },
                {
                    id: col2,
                    groups: [
                        { nodes: [dro_c1, dro_c2], parentId: dro },
                        { nodes: [tar_c1, tar_c2], parentId: tar },
                    ],
                },
                {
                    id: col3,
                    groups: [
                        { nodes: [dro_c1_c1, dro_c1_c2], parentId: dro_c1 },
                        { nodes: [dro_c2_c1, dro_c2_c2], parentId: dro_c2 },
                        { nodes: [tar_c1_c1, tar_c1_c2], parentId: tar_c1 },
                        { nodes: [tar_c2_c1, tar_c2_c2], parentId: tar_c2 },
                    ],
                },
                {
                    id: col4,
                    groups: [
                        { nodes: [dro_c1_c1_c1], parentId: dro_c1_c1 },
                        { nodes: [dro_c2_c1_c1], parentId: dro_c2_c1 },
                        { nodes: [tar_c1_c1_c1], parentId: tar_c1_c1 },
                        { nodes: [tar_c2_c1_c1], parentId: tar_c2_c1 },
                    ],
                },
            ],
            state: {
                activeNode: dro,
            },
        };
        const col5 = 'cjDt';
        const output = {
            columns: [
                { id: col1, groups: [{ nodes: [tar], parentId: root }] },
                {
                    id: col2,
                    groups: [{ nodes: [tar_c1, tar_c2, dro], parentId: tar }],
                },
                {
                    id: col3,
                    groups: [
                        { nodes: [tar_c1_c1, tar_c1_c2], parentId: tar_c1 },
                        { nodes: [tar_c2_c1, tar_c2_c2], parentId: tar_c2 },
                        { nodes: [dro_c1, dro_c2], parentId: dro },
                    ],
                },
                {
                    id: col4,
                    groups: [
                        { nodes: [tar_c1_c1_c1], parentId: tar_c1_c1 },
                        { nodes: [tar_c2_c1_c1], parentId: tar_c2_c1 },
                        { nodes: [dro_c1_c1, dro_c1_c2], parentId: dro_c1 },
                        { nodes: [dro_c2_c1, dro_c2_c2], parentId: dro_c2 },
                    ],
                },
                {
                    id: col5,
                    groups: [
                        { nodes: [dro_c1_c1_c1], parentId: dro_c1_c1 },
                        { nodes: [dro_c2_c1_c1], parentId: dro_c2_c1 },
                    ],
                },
            ],
            state: {
                activeNode: dro,
            },
        };
        dropNode(input.columns, input.state, action);
        input.columns[4].id = col5;
        expect(input.columns).toEqual(output.columns);
        expect(output.state).toEqual(output.state);
    });
    test('2*** right to 1****', () => {
        const dro = 'nPMX';
        const tar = 'naO-';
        const action = {
            type: 'DOCUMENT/DROP_NODE',
            payload: {
                droppedNodeId: dro,
                targetNodeId: tar,
                position: 'right',
            },
        } as const;
        const col1 = 'cyQp';
        const col2 = 'cw-b';
        const col3 = 'c5iE';
        const col4 = 'cWSU';
        const dro_c1 = 'nrl-';
        const dro_c2 = 'nsm8';
        const tar_c1 = 'ntNg';
        const tar_c2 = 'nany';
        const dro_c1_c1 = 'nVx2';
        const dro_c1_c1_c1 = 'nmdL';
        const dro_c1_c2 = 'no7z';
        const dro_c2_c1 = 'nb2Q';
        const dro_c2_c2 = 'nwTB';
        const tar_c1_c1 = 'nvTy';
        const tar_c1_c2 = 'nxll';
        const tar_c2_c1 = 'nEkY';
        const tar_c2_c2 = 'n9ha';
        const dro_c2_c1_c1 = 'nAM-';
        const tar_c1_c1_c1 = 'nV17';
        const tar_c2_c1_c1 = 'nQrU';
        const input = {
            columns: [
                {
                    id: col1,
                    groups: [{ nodes: [dro, tar], parentId: 'rac7' }],
                },
                {
                    id: col2,
                    groups: [
                        { nodes: [dro_c1, dro_c2], parentId: dro },
                        { nodes: [tar_c1, tar_c2], parentId: tar },
                    ],
                },
                {
                    id: col3,
                    groups: [
                        { nodes: [dro_c1_c1, dro_c1_c2], parentId: dro_c1 },
                        { nodes: [dro_c2_c1, dro_c2_c2], parentId: dro_c2 },
                        { nodes: [tar_c1_c1, tar_c1_c2], parentId: tar_c1 },
                        { nodes: [tar_c2_c1, tar_c2_c2], parentId: tar_c2 },
                    ],
                },
                {
                    id: col4,
                    groups: [
                        { nodes: [dro_c1_c1_c1], parentId: dro_c1_c1 },
                        { nodes: [dro_c2_c1_c1], parentId: dro_c2_c1 },
                        { nodes: [tar_c1_c1_c1], parentId: tar_c1_c1 },
                        { nodes: [tar_c2_c1_c1], parentId: tar_c2_c1 },
                    ],
                },
            ],
            state: {
                activeNode: dro,
            },
        };
        const col5 = 'crVB';
        const output = {
            columns: [
                { id: col1, groups: [{ nodes: [tar], parentId: 'rac7' }] },
                {
                    id: col2,
                    groups: [{ nodes: [tar_c1, tar_c2, dro], parentId: tar }],
                },
                {
                    id: col3,
                    groups: [
                        { nodes: [tar_c1_c1, tar_c1_c2], parentId: tar_c1 },
                        { nodes: [tar_c2_c1, tar_c2_c2], parentId: tar_c2 },
                        { nodes: [dro_c1, dro_c2], parentId: dro },
                    ],
                },
                {
                    id: col4,
                    groups: [
                        { nodes: [tar_c1_c1_c1], parentId: tar_c1_c1 },
                        { nodes: [tar_c2_c1_c1], parentId: tar_c2_c1 },
                        { nodes: [dro_c1_c1, dro_c1_c2], parentId: dro_c1 },
                        { nodes: [dro_c2_c1, dro_c2_c2], parentId: dro_c2 },
                    ],
                },
                {
                    id: col5,
                    groups: [
                        { nodes: [dro_c1_c1_c1], parentId: dro_c1_c1 },
                        { nodes: [dro_c2_c1_c1], parentId: dro_c2_c1 },
                    ],
                },
            ],
            state: {
                activeNode: dro,
            },
        };
        dropNode(input.columns, input.state, action);
        input.columns[4].id = col5;
        expect(input.columns).toEqual(output.columns);
        expect(output.state).toEqual(output.state);
    });
    test('1*** right to tail of 1***', () => {
        const dro = 'nWIN';
        const tar = 'n4WH';
        const action = {
            type: 'DOCUMENT/DROP_NODE',
            payload: {
                droppedNodeId: dro,
                targetNodeId: tar,
                position: 'right',
            },
        } as const;
        const dro_c1 = 'nDgl';
        const dro_c2 = 'n3SV';
        const dro_c1_c1 = 'ns2S';
        const dro_c1_c2 = 'nQTR';
        const dro_c2_c1 = 'n9lR';
        const dro_c2_c2 = 'nyIb';
        const dro_c1_c1_c1 = 'nZDy';
        const dro_c2_c1_c1 = 'nMlS';
        const col1 = 'cYnA';
        const col2 = 'ccf3';
        const col3 = 'cfT7';
        const col4 = 'cJ-M';
        const input = {
            columns: [
                {
                    id: col1,
                    groups: [{ nodes: [dro, 'ngQD'], parentId: 'rH33' }],
                },
                {
                    id: col2,
                    groups: [
                        { nodes: [dro_c1, dro_c2], parentId: dro },
                        { nodes: ['nrSz', 'nX72'], parentId: 'ngQD' },
                    ],
                },
                {
                    id: col3,
                    groups: [
                        { nodes: [dro_c1_c1, dro_c1_c2], parentId: dro_c1 },

                        { nodes: [dro_c2_c1, dro_c2_c2], parentId: dro_c2 },
                        { nodes: ['nitG', 'nIM6'], parentId: 'nrSz' },
                        { nodes: ['nUfg', 'ngni'], parentId: 'nX72' },
                    ],
                },
                {
                    id: col4,
                    groups: [
                        { nodes: [dro_c1_c1_c1], parentId: dro_c1_c1 },
                        { nodes: [dro_c2_c1_c1], parentId: dro_c2_c1 },
                        { nodes: [tar], parentId: 'nitG' },
                        { nodes: ['nSpg'], parentId: 'nUfg' },
                    ],
                },
            ],
            state: {
                activeNode: dro,
            },
        };
        const col5 = 'cGBl';
        const col6 = 'cxnH';
        const col7 = 'cHR6';
        const col8 = 'cV5L';
        const output = {
            columns: [
                { id: col1, groups: [{ nodes: ['ngQD'], parentId: 'rH33' }] },
                {
                    id: col2,
                    groups: [{ nodes: ['nrSz', 'nX72'], parentId: 'ngQD' }],
                },
                {
                    id: col3,
                    groups: [
                        { nodes: ['nitG', 'nIM6'], parentId: 'nrSz' },
                        { nodes: ['nUfg', 'ngni'], parentId: 'nX72' },
                    ],
                },
                {
                    id: col4,
                    groups: [
                        { nodes: [tar], parentId: 'nitG' },
                        { nodes: ['nSpg'], parentId: 'nUfg' },
                    ],
                },
                { id: col5, groups: [{ nodes: [dro], parentId: tar }] },
                {
                    id: col6,
                    groups: [{ nodes: [dro_c1, dro_c2], parentId: dro }],
                },
                {
                    id: col7,
                    groups: [
                        { nodes: [dro_c1_c1, dro_c1_c2], parentId: dro_c1 },
                        { nodes: [dro_c2_c1, dro_c2_c2], parentId: dro_c2 },
                    ],
                },
                {
                    id: col8,
                    groups: [
                        { nodes: [dro_c1_c1_c1], parentId: dro_c1_c1 },
                        { nodes: [dro_c2_c1_c1], parentId: dro_c2_c1 },
                    ],
                },
            ],
            state: {
                activeNode: dro,
            },
        };
        dropNode(input.columns, input.state, action);
        input.columns[4].id = col5;
        input.columns[5].id = col6;
        input.columns[6].id = col7;
        input.columns[7].id = col8;
        expect(input.columns).toEqual(output.columns);
        expect(output.state).toEqual(output.state);
    });
    test('*2** under to tail of 1***', () => {
        const dro = 'noRE';
        const tar = 'ntb4';
        const action = {
            type: 'DOCUMENT/DROP_NODE',
            payload: {
                droppedNodeId: dro,
                targetNodeId: tar,
                position: 'down',
            },
        } as const;
        const col1 = 'cAZ4';
        const col2 = 'ctud';
        const col3 = 'cx8U';
        const col4 = 'ctCe';
        const input = {
            columns: [
                {
                    id: col1,
                    groups: [{ nodes: ['nUPO', 'n88Q'], parentId: 'raRC' }],
                },
                {
                    id: col2,
                    groups: [
                        { nodes: ['nPzt', dro], parentId: 'nUPO' },
                        { nodes: ['nehu', 'nQ4l'], parentId: 'n88Q' },
                    ],
                },
                {
                    id: col3,
                    groups: [
                        { nodes: ['nC-S', 'ngeA'], parentId: 'nPzt' },
                        { nodes: ['ndO_', 'n6P3'], parentId: dro },
                        { nodes: ['nV96', 'nDBs'], parentId: 'nehu' },
                        { nodes: ['n9OD', 'nD6q'], parentId: 'nQ4l' },
                    ],
                },
                {
                    id: col4,
                    groups: [
                        { nodes: ['nx0W'], parentId: 'nC-S' },
                        { nodes: ['n1qC'], parentId: 'ndO_' },
                        { nodes: ['n4ML'], parentId: 'nV96' },
                        { nodes: [tar], parentId: 'n9OD' },
                    ],
                },
            ],
            state: {
                activeNode: dro,
            },
        };
        const col5 = 'cbht';
        const col6 = 'c8qK';
        const output = {
            columns: [
                {
                    id: col1,
                    groups: [{ nodes: ['nUPO', 'n88Q'], parentId: 'raRC' }],
                },
                {
                    id: col2,
                    groups: [
                        { nodes: ['nPzt'], parentId: 'nUPO' },
                        { nodes: ['nehu', 'nQ4l'], parentId: 'n88Q' },
                    ],
                },
                {
                    id: col3,
                    groups: [
                        { nodes: ['nC-S', 'ngeA'], parentId: 'nPzt' },
                        { nodes: ['nV96', 'nDBs'], parentId: 'nehu' },
                        { nodes: ['n9OD', 'nD6q'], parentId: 'nQ4l' },
                    ],
                },
                {
                    id: col4,
                    groups: [
                        { nodes: ['nx0W'], parentId: 'nC-S' },
                        { nodes: ['n4ML'], parentId: 'nV96' },
                        { nodes: [tar, dro], parentId: 'n9OD' },
                    ],
                },
                {
                    id: col5,
                    groups: [{ nodes: ['ndO_', 'n6P3'], parentId: dro }],
                },
                { id: col6, groups: [{ nodes: ['n1qC'], parentId: 'ndO_' }] },
            ],
            state: {
                activeNode: dro,
            },
        };
        dropNode(input.columns, input.state, action);
        input.columns[4].id = col5;
        input.columns[5].id = col6;

        expect(input.columns).toEqual(output.columns);
        expect(output.state).toEqual(output.state);
    });
});
