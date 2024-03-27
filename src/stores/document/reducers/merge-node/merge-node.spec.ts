import { describe, expect, test } from 'vitest';
import { LineageDocument } from 'src/stores/document/document-state-type';
import {
    mergeNode,
    MergeNodeAction,
} from 'src/stores/document/reducers/merge-node/merge-node';

type Output = LineageDocument & { state: { activeNode: string } };
type Input = LineageDocument & { action: MergeNodeAction };
describe('merge node', () => {
    test('case: two nodes, merge up', () => {
        const mergedNode = 'nrIb';
        const targetNode = 'n8Nd';
        const input = {
            columns: [
                {
                    id: 'cO2t',
                    groups: [
                        { nodes: [targetNode, mergedNode], parentId: 'r60v' },
                    ],
                },
            ],
            content: { n8Nd: { content: '1' }, nrIb: { content: '2' } },
            action: {
                type: 'DOCUMENT/MERGE_NODE',
                payload: { direction: 'up', activeNodeId: mergedNode },
            },
        } satisfies Input;

        const output = {
            columns: [
                {
                    id: 'cO2t',
                    groups: [{ nodes: [targetNode], parentId: 'r60v' }],
                },
            ],
            content: { n8Nd: { content: '1\n2' } },
            state: {
                activeNode: targetNode,
            },
        };

        mergeNode(input.columns, input.content, input.action);
        expect(input.columns).toEqual(output.columns);
        expect(input.content).toEqual(output.content);
    });
    test('case: two nodes, merge down', () => {
        const input = {
            columns: [
                {
                    id: 'cWsM',
                    groups: [{ nodes: ['nTlU', 'nc8J'], parentId: 'rv0p' }],
                },
            ],

            content: { nTlU: { content: '1' }, nc8J: { content: '2' } },
            action: {
                type: 'DOCUMENT/MERGE_NODE',
                payload: { direction: 'down', activeNodeId: 'nTlU' },
            },
        } satisfies Input;
        const output = {
            columns: [
                {
                    id: 'cWsM',
                    groups: [{ nodes: ['nc8J'], parentId: 'rv0p' }],
                },
            ],
            state: {
                activeNode: 'nc8J',
            },
            content: { nc8J: { content: '1\n2' } },
        } satisfies Output;
        mergeNode(input.columns, input.content, input.action);
        expect(input.columns).toEqual(output.columns);
        expect(input.content).toEqual(output.content);
    });
    test('case: two nodes, different groups, merge up', () => {
        const mergedNode = 'noVy';
        const targetNode = 'nsPj';
        const input = {
            columns: [
                {
                    id: 'cJhz',
                    groups: [{ nodes: ['nBe1', 'nGQX'], parentId: 'rp4F' }],
                },
                {
                    id: 'cUUu',
                    groups: [
                        { nodes: [targetNode], parentId: 'nBe1' },
                        { nodes: [mergedNode], parentId: 'nGQX' },
                    ],
                },
            ],

            content: {
                nBe1: { content: '1' },
                nsPj: { content: '1.1' },
                nGQX: { content: '2' },
                noVy: { content: '2.1' },
            },
            action: {
                type: 'DOCUMENT/MERGE_NODE',
                payload: { direction: 'up', activeNodeId: mergedNode },
            },
        } satisfies Input;
        const output = {
            columns: [
                {
                    id: 'cJhz',
                    groups: [{ nodes: ['nBe1', 'nGQX'], parentId: 'rp4F' }],
                },
                {
                    id: 'cUUu',
                    groups: [{ nodes: [targetNode], parentId: 'nBe1' }],
                },
            ],
            state: {
                activeNode: targetNode,
            },
            content: {
                nBe1: { content: '1' },
                nGQX: { content: '2' },
                nsPj: { content: '1.1\n2.1' },
            },
        } satisfies Output;
        mergeNode(input.columns, input.content, input.action);
        expect(input.columns).toEqual(output.columns);
        expect(input.content).toEqual(output.content);
    });
    test('case: two nodes, different groups, merge down', () => {
        const mergedNode = 'n5WQ';
        const targetNode = 'ngoB';
        const input = {
            columns: [
                {
                    id: 'cJC4',
                    groups: [{ nodes: ['nPUy', 'nfIb'], parentId: 'rIpU' }],
                },
                {
                    id: 'c4Be',
                    groups: [
                        { nodes: [mergedNode], parentId: 'nPUy' },
                        { nodes: [targetNode], parentId: 'nfIb' },
                    ],
                },
            ],

            content: {
                nPUy: { content: '1' },
                n5WQ: { content: '1.1' },
                nfIb: { content: '2' },
                ngoB: { content: '2.1' },
            },
            action: {
                type: 'DOCUMENT/MERGE_NODE',
                payload: { direction: 'down', activeNodeId: mergedNode },
            },
        } satisfies Input;
        const output = {
            columns: [
                {
                    id: 'cJC4',
                    groups: [{ nodes: ['nPUy', 'nfIb'], parentId: 'rIpU' }],
                },
                {
                    id: 'c4Be',
                    groups: [{ nodes: [targetNode], parentId: 'nfIb' }],
                },
            ],
            state: {
                activeNode: targetNode,
            },
            content: {
                nPUy: { content: '1' },
                nfIb: { content: '2' },
                ngoB: { content: '1.1\n2.1' },
            },
        } satisfies Output;
        mergeNode(input.columns, input.content, input.action);
        expect(input.columns).toEqual(output.columns);
        expect(input.content).toEqual(output.content);
    });
    test('case: two parents with children and grandchildren, up', () => {
        const n2 = 'nBAt';
        const n1 = 'nZmk';
        const n1_1 = 'nQnn';
        const n2_1 = 'n_lG';
        const n1_1_1 = 'nYQz';
        const n1_1_2 = 'nfXF';
        const n2_1_1 = 'nXlL';
        const n2_1_2 = 'nX1f';
        const rootNode = 'rk1k';
        const input = {
            columns: [
                {
                    id: 'cGKb',
                    groups: [{ nodes: [n1, n2], parentId: rootNode }],
                },
                {
                    id: 'c406',
                    groups: [
                        { nodes: [n1_1], parentId: n1 },
                        { nodes: [n2_1], parentId: n2 },
                    ],
                },
                {
                    id: 'cvC7',
                    groups: [
                        {
                            nodes: [n1_1_1, n1_1_2],
                            parentId: n1_1,
                        },
                        {
                            nodes: [n2_1_1, n2_1_2],
                            parentId: n2_1,
                        },
                    ],
                },
            ],

            content: {
                nZmk: { content: '1' },
                nQnn: { content: '1.1' },
                nYQz: { content: '1.1.1' },
                nfXF: { content: '1.1.2' },
                nBAt: { content: '2' },
                n_lG: { content: '2.1' },
                nXlL: { content: '2.1.1' },
                nX1f: { content: '2.1.2' },
            },
            action: {
                type: 'DOCUMENT/MERGE_NODE',
                payload: { direction: 'up', activeNodeId: n2 },
            },
        } as Input;
        const output = {
            columns: [
                {
                    id: 'cGKb',
                    groups: [{ nodes: [n1], parentId: rootNode }],
                },
                {
                    id: 'c406',
                    groups: [
                        {
                            nodes: [n1_1, n2_1],
                            parentId: n1,
                        },
                    ],
                },
                {
                    id: 'cvC7',
                    groups: [
                        {
                            nodes: [n1_1_1, n1_1_2],
                            parentId: n1_1,
                        },
                        {
                            nodes: [n2_1_1, n2_1_2],
                            parentId: n2_1,
                        },
                    ],
                },
            ],
            state: {
                activeNode: n1,
            },
            content: {
                nZmk: { content: '1\n2' },
                nQnn: { content: '1.1' },
                nYQz: { content: '1.1.1' },
                nfXF: { content: '1.1.2' },
                n_lG: { content: '2.1' },
                nXlL: { content: '2.1.1' },
                nX1f: { content: '2.1.2' },
            },
        } as Output;
        mergeNode(input.columns, input.content, input.action);
        expect(input.columns).toEqual(output.columns);
        expect(input.content).toEqual(output.content);
    });
    test('case: two parents with children and grand children, down', () => {
        const n1 = 'nZmk';
        const n2 = 'nBAt';
        const n1_1 = 'n_lG';
        const n2_1 = 'nQnn';
        const n1_1_1 = 'nYQz';
        const n1_1_2 = 'nfXF';
        const n2_1_1 = 'nXlL';
        const n2_1_2 = 'nX1f';
        const rootNode = 'rk1k';
        const input = {
            columns: [
                {
                    id: 'cGKb',
                    groups: [{ nodes: [n1, n2], parentId: rootNode }],
                },
                {
                    id: 'c406',
                    groups: [
                        { nodes: [n1_1], parentId: n1 },
                        { nodes: [n2_1], parentId: n2 },
                    ],
                },
                {
                    id: 'cvC7',
                    groups: [
                        {
                            nodes: [n1_1_1, n1_1_2],
                            parentId: n1_1,
                        },
                        {
                            nodes: [n2_1_1, n2_1_2],
                            parentId: n2_1,
                        },
                    ],
                },
            ],

            content: {
                nZmk: { content: '1' },
                nQnn: { content: '1.1' },
                nYQz: { content: '1.1.1' },
                nfXF: { content: '1.1.2' },
                nBAt: { content: '2' },
                n_lG: { content: '2.1' },
                nXlL: { content: '2.1.1' },
                nX1f: { content: '2.1.2' },
            },
            action: {
                type: 'DOCUMENT/MERGE_NODE',
                payload: { direction: 'down', activeNodeId: n1 },
            },
        } as Input;
        const output = {
            columns: [
                {
                    id: 'cGKb',
                    groups: [{ nodes: [n2], parentId: rootNode }],
                },
                {
                    id: 'c406',
                    groups: [
                        {
                            nodes: [n1_1, n2_1],
                            parentId: n2,
                        },
                    ],
                },
                {
                    id: 'cvC7',
                    groups: [
                        {
                            nodes: [n1_1_1, n1_1_2],
                            parentId: n1_1,
                        },
                        {
                            nodes: [n2_1_1, n2_1_2],
                            parentId: n2_1,
                        },
                    ],
                },
            ],
            state: {
                activeNode: n2,
            },
            content: {
                nBAt: { content: '1\n2' },
                nQnn: { content: '1.1' },
                nYQz: { content: '1.1.1' },
                nfXF: { content: '1.1.2' },
                n_lG: { content: '2.1' },
                nXlL: { content: '2.1.1' },
                nX1f: { content: '2.1.2' },
            },
        } as Output;
        mergeNode(input.columns, input.content, input.action);
        expect(input.columns).toEqual(output.columns);
        expect(input.content).toEqual(output.content);
    });

    test('case: two parents from different groups parents and children, up', () => {
        const mergedNode = 'ntgV';
        const targetNode = 'ny5H';
        const parentOfTargetNode = 'n_2t';
        const parentOfMergedNode = 'nzjB';
        const child1OfTargetNode = 'n4Zp';
        const child2OfTargetNode = 'ng3i';
        const child1OfMergedNode = 'nvRU';
        const child2OfMergedNode = 'nL-q';
        const input = {
            columns: [
                {
                    id: 'c7MT',
                    groups: [
                        {
                            nodes: [parentOfTargetNode, parentOfMergedNode],
                            parentId: 'rV-2',
                        },
                    ],
                },
                {
                    id: 'cQNS',
                    groups: [
                        { nodes: [targetNode], parentId: parentOfTargetNode },
                        { nodes: [mergedNode], parentId: parentOfMergedNode },
                    ],
                },
                {
                    id: 'cacr',
                    groups: [
                        {
                            nodes: [child1OfTargetNode, child2OfTargetNode],
                            parentId: targetNode,
                        },
                        {
                            nodes: [child1OfMergedNode, child2OfMergedNode],
                            parentId: mergedNode,
                        },
                    ],
                },
            ],

            content: {
                n_2t: { content: '1' },
                ny5H: { content: '1.1' },
                n4Zp: { content: '1.1.1' },
                ng3i: { content: '1.1.2' },
                nzjB: { content: '2' },
                ntgV: { content: '2.1' },
                nvRU: { content: '2.1.1' },
                'nL-q': { content: '2.1.2' },
            },
            action: {
                type: 'DOCUMENT/MERGE_NODE',
                payload: { direction: 'up', activeNodeId: mergedNode },
            },
        } satisfies Input;
        const output = {
            columns: [
                {
                    id: 'c7MT',
                    groups: [
                        {
                            nodes: [parentOfTargetNode, parentOfMergedNode],
                            parentId: 'rV-2',
                        },
                    ],
                },
                {
                    id: 'cQNS',
                    groups: [
                        { nodes: [targetNode], parentId: parentOfTargetNode },
                    ],
                },
                {
                    id: 'cacr',
                    groups: [
                        {
                            nodes: [
                                child1OfTargetNode,
                                child2OfTargetNode,
                                child1OfMergedNode,
                                child2OfMergedNode,
                            ],
                            parentId: targetNode,
                        },
                    ],
                },
            ],
            state: {
                activeNode: targetNode,
            },
            content: {
                n_2t: { content: '1' },
                ny5H: { content: '1.1\n2.1' },
                n4Zp: { content: '1.1.1' },
                ng3i: { content: '1.1.2' },
                nzjB: { content: '2' },
                nvRU: { content: '2.1.1' },
                'nL-q': { content: '2.1.2' },
            },
        };
        mergeNode(input.columns, input.content, input.action);
        expect(input.columns).toEqual(output.columns);
        expect(input.content).toEqual(output.content);
    });

    test('case: two parents with children and grandchildren, down', () => {
        const mergedNode = 'ncX8';
        const targetNode = 'nXCc';
        const child1OfTargetNode = 'n8TT';
        const child2OFTargetNode = 'ncc7';
        const child1OfMergedNode = 'n_4B';
        const child2OFMergedNode = 'nltq';
        const parentOfTargetNode = 'naP1';
        const parentOfMergedNode = 'nKBb';
        const input = {
            columns: [
                {
                    id: 'c7e_',
                    groups: [
                        {
                            nodes: [parentOfMergedNode, parentOfTargetNode],
                            parentId: 'rDoe',
                        },
                    ],
                },
                {
                    id: 'cLr2',
                    groups: [
                        { nodes: [mergedNode], parentId: parentOfMergedNode },
                        { nodes: [targetNode], parentId: parentOfTargetNode },
                    ],
                },
                {
                    id: 'cCIx',
                    groups: [
                        {
                            nodes: [child1OfMergedNode, child2OFMergedNode],
                            parentId: mergedNode,
                        },
                        {
                            nodes: [child1OfTargetNode, child2OFTargetNode],
                            parentId: targetNode,
                        },
                    ],
                },
            ],

            content: {
                nKBb: { content: '1' },
                ncX8: { content: '1.1' },
                n_4B: { content: '1.1.1' },
                nltq: { content: '1.1.2' },
                naP1: { content: '2' },
                nXCc: { content: '2.1' },
                n8TT: { content: '2.1.1' },
                ncc7: { content: '2.1.2' },
            },
            action: {
                type: 'DOCUMENT/MERGE_NODE',
                payload: { direction: 'down', activeNodeId: mergedNode },
            },
        } satisfies Input;
        const output = {
            columns: [
                {
                    id: 'c7e_',
                    groups: [
                        {
                            nodes: [parentOfMergedNode, parentOfTargetNode],
                            parentId: 'rDoe',
                        },
                    ],
                },
                {
                    id: 'cLr2',
                    groups: [
                        { nodes: [targetNode], parentId: parentOfTargetNode },
                    ],
                },
                {
                    id: 'cCIx',
                    groups: [
                        {
                            nodes: [
                                child1OfMergedNode,
                                child2OFMergedNode,
                                child1OfTargetNode,
                                child2OFTargetNode,
                            ],
                            parentId: targetNode,
                        },
                    ],
                },
            ],
            state: {
                activeNode: targetNode,
            },
            content: {
                nKBb: { content: '1' },
                // ncX8: { content: '1.1' },
                n_4B: { content: '1.1.1' },
                nltq: { content: '1.1.2' },
                naP1: { content: '2' },
                nXCc: { content: '1.1\n2.1' },
                n8TT: { content: '2.1.1' },
                ncc7: { content: '2.1.2' },
            },
        } satisfies Output;
        mergeNode(input.columns, input.content, input.action);
        expect(input.columns).toEqual(output.columns);
        expect(input.content).toEqual(output.content);
    });
    test('case: grandparent with a childless node, down', () => {
        const mergedNode = 'nQeK';
        const targetNode = 'nI7O';
        const siblingOfTargetNode = 'nKk_';
        const childOfMergedNode = 'n74i';
        const childOfSiblingOfTagetNode = 'nPb3';
        const grandChildOfMergedNode1 = 'nULs';
        const grandChildOfMergedNode2 = 'neN5';
        const input = {
            columns: [
                {
                    id: 'cQkj',
                    groups: [
                        {
                            nodes: [
                                mergedNode,
                                targetNode,
                                siblingOfTargetNode,
                            ],
                            parentId: 'rYY4',
                        },
                    ],
                },
                {
                    id: 'cjqW',
                    groups: [
                        { nodes: [childOfMergedNode], parentId: mergedNode },
                        {
                            nodes: [childOfSiblingOfTagetNode],
                            parentId: siblingOfTargetNode,
                        },
                    ],
                },
                {
                    id: 'cfz_',
                    groups: [
                        {
                            nodes: [
                                grandChildOfMergedNode1,
                                grandChildOfMergedNode2,
                            ],
                            parentId: childOfMergedNode,
                        },

                        {
                            nodes: ['nuPi', 'nbKt'],
                            parentId: childOfSiblingOfTagetNode,
                        },
                    ],
                },
            ],
            content: {
                nQeK: { content: '1' },
                n74i: { content: '1.1' },
                nULs: { content: '1.1.1' },
                neN5: { content: '1.1.2' },
                nI7O: { content: 'middle' },
                nKk_: { content: '2' },
                nPb3: { content: '2.1' },
                nuPi: { content: '2.1.1' },
                nbKt: { content: '2.1.2' },
            },
        } as LineageDocument;
        const action = {
            type: 'DOCUMENT/MERGE_NODE',
            payload: { direction: 'down', activeNodeId: mergedNode },
        } as const;
        const output = {
            columns: [
                {
                    id: 'cQkj',
                    groups: [
                        {
                            nodes: [targetNode, siblingOfTargetNode],
                            parentId: 'rYY4',
                        },
                    ],
                },
                {
                    id: 'cjqW',
                    groups: [
                        { nodes: [childOfMergedNode], parentId: targetNode },
                        {
                            nodes: [childOfSiblingOfTagetNode],
                            parentId: siblingOfTargetNode,
                        },
                    ],
                },
                {
                    id: 'cfz_',
                    groups: [
                        {
                            nodes: [
                                grandChildOfMergedNode1,
                                grandChildOfMergedNode2,
                            ],
                            parentId: childOfMergedNode,
                        },
                        {
                            nodes: ['nuPi', 'nbKt'],
                            parentId: childOfSiblingOfTagetNode,
                        },
                    ],
                },
            ],
            content: {
                n74i: { content: '1.1' },
                nULs: { content: '1.1.1' },
                neN5: { content: '1.1.2' },
                nI7O: { content: '1\nmiddle' },
                nKk_: { content: '2' },
                nPb3: { content: '2.1' },
                nuPi: { content: '2.1.1' },
                nbKt: { content: '2.1.2' },
            },
            state: {
                activeNode: targetNode,
            },
        } satisfies Output;
        mergeNode(input.columns, input.content, action);
        expect(input.columns).toEqual(output.columns);
        expect(input.content).toEqual(output.content);
    });

    test('case: grandparent with a childless node, up', () => {
        const siblingOfTargetNode = 'nOF7';
        const targetNode = 'nwzu';
        const megedNode = 'n8H_';
        const childOfSiblingOfTagetNode = 'nGx6';
        const childOfMergedNode = 'nSWY';
        const grandChildOfMergedNode1 = 'nwQt';
        const grandChildOfMergedNode2 = 'ndoV';
        const input = {
            columns: [
                {
                    id: 'c5xK',
                    groups: [
                        {
                            nodes: [siblingOfTargetNode, targetNode, megedNode],
                            parentId: 'rINO',
                        },
                    ],
                },
                {
                    id: 'c3Zx',
                    groups: [
                        {
                            nodes: [childOfSiblingOfTagetNode],
                            parentId: siblingOfTargetNode,
                        },
                        { nodes: [childOfMergedNode], parentId: megedNode },
                    ],
                },
                {
                    id: 'cZ6G',
                    groups: [
                        {
                            nodes: ['nyFL', 'n5HG'],
                            parentId: childOfSiblingOfTagetNode,
                        },
                        {
                            nodes: [
                                grandChildOfMergedNode1,
                                grandChildOfMergedNode2,
                            ],
                            parentId: childOfMergedNode,
                        },
                    ],
                },
            ],
            content: {
                nOF7: { content: '1' },
                nGx6: { content: '1.1' },
                nyFL: { content: '1.1.1' },
                n5HG: { content: '1.1.2' },
                nwzu: { content: 'middle' },
                n8H_: { content: '2' },
                nSWY: { content: '2.1' },
                nwQt: { content: '2.1.1' },
                ndoV: { content: '2.1.2' },
            },
        } satisfies LineageDocument;
        const action = {
            type: 'DOCUMENT/MERGE_NODE',
            payload: { direction: 'up', activeNodeId: megedNode },
        } as const;
        const output = {
            columns: [
                {
                    id: 'c5xK',
                    groups: [
                        {
                            nodes: [siblingOfTargetNode, targetNode],
                            parentId: 'rINO',
                        },
                    ],
                },
                {
                    id: 'c3Zx',
                    groups: [
                        {
                            nodes: [childOfSiblingOfTagetNode],
                            parentId: siblingOfTargetNode,
                        },
                        { nodes: [childOfMergedNode], parentId: targetNode },
                    ],
                },
                {
                    id: 'cZ6G',
                    groups: [
                        {
                            nodes: ['nyFL', 'n5HG'],
                            parentId: childOfSiblingOfTagetNode,
                        },
                        {
                            nodes: [
                                grandChildOfMergedNode1,
                                grandChildOfMergedNode2,
                            ],
                            parentId: childOfMergedNode,
                        },
                    ],
                },
            ],
            content: {
                nOF7: { content: '1' },
                nGx6: { content: '1.1' },
                nyFL: { content: '1.1.1' },
                n5HG: { content: '1.1.2' },
                nwzu: { content: 'middle\n2' },
                nSWY: { content: '2.1' },
                nwQt: { content: '2.1.1' },
                ndoV: { content: '2.1.2' },
            },
            state: {
                activeNode: targetNode,
            },
        };
        mergeNode(input.columns, input.content, action);
        expect(input.columns).toEqual(output.columns);
        expect(input.content).toEqual(output.content);
    });
    test('case: parent with a childless node, down', () => {
        const merged = 'nvcz';
        const merged_parent = 'n2wC';
        const merged_child_1 = 'n_UB';
        const target = 'nBBa';
        const target_parent = 'nvL-';
        const target_sibling = 'nxds';
        const merged_child_2 = 'nZrI';
        const target_sibling_child_1 = 'nZss';
        const target_sibling_child_2 = 'nIgL';
        const input = {
            columns: [
                {
                    id: 'cQdZ',
                    groups: [
                        {
                            nodes: [merged_parent, target_parent],
                            parentId: 'rCbW',
                        },
                    ],
                },
                {
                    id: 'c7Ea',
                    groups: [
                        { nodes: [merged], parentId: merged_parent },
                        {
                            nodes: [target, target_sibling],
                            parentId: target_parent,
                        },
                    ],
                },
                {
                    id: 'cHoa',
                    groups: [
                        {
                            nodes: [merged_child_1, merged_child_2],
                            parentId: merged,
                        },
                        {
                            nodes: [
                                target_sibling_child_1,
                                target_sibling_child_2,
                            ],
                            parentId: target_sibling,
                        },
                    ],
                },
            ],
            content: {
                n2wC: { content: '1' },
                nvcz: { content: '1.1' },
                n_UB: { content: '1.1.1' },
                nZrI: { content: '1.1.2' },
                'nvL-': { content: '2' },
                nxds: { content: '2.1' },
                nZss: { content: '2.1.1' },
                nIgL: { content: '2.1.2' },
                nBBa: { content: 'middle' },
            },
        } satisfies LineageDocument;
        const action = {
            type: 'DOCUMENT/MERGE_NODE',
            payload: { direction: 'down', activeNodeId: merged },
        } as const;
        const output = {
            columns: [
                {
                    id: 'cQdZ',
                    groups: [
                        {
                            nodes: [merged_parent, target_parent],
                            parentId: 'rCbW',
                        },
                    ],
                },
                {
                    id: 'c7Ea',
                    groups: [
                        {
                            nodes: [target, target_sibling],
                            parentId: target_parent,
                        },
                    ],
                },
                {
                    id: 'cHoa',
                    groups: [
                        {
                            nodes: [merged_child_1, merged_child_2],
                            parentId: target,
                        },
                        {
                            nodes: [
                                target_sibling_child_1,
                                target_sibling_child_2,
                            ],
                            parentId: target_sibling,
                        },
                    ],
                },
            ],
            content: {
                n2wC: { content: '1' },
                n_UB: { content: '1.1.1' },
                nZrI: { content: '1.1.2' },
                'nvL-': { content: '2' },
                nxds: { content: '2.1' },
                nZss: { content: '2.1.1' },
                nIgL: { content: '2.1.2' },
                nBBa: { content: '1.1\nmiddle' },
            },
            state: {
                activeNode: target,
            },
        };
        mergeNode(input.columns, input.content, action);
        expect(input.columns).toEqual(output.columns);
        expect(input.content).toEqual(output.content);
    });
    test('case: parent with a childless node, up', () => {
        const merged = 'n2xm';
        const merged_parent = 'nlfk';
        const target = 'nqZO';
        const target_parent = 'nKnN';
        const merged_child_1 = 'nquj';
        const merged_child_2 = 'naR2';
        const target_sibling = 'nfaY';
        const input = {
            columns: [
                {
                    id: 'ctOc',
                    groups: [
                        {
                            nodes: [target_parent, merged_parent],
                            parentId: 'rvHb',
                        },
                    ],
                },
                {
                    id: 'cVkK',
                    groups: [
                        {
                            nodes: [target_sibling, target],
                            parentId: target_parent,
                        },
                        { nodes: [merged], parentId: merged_parent },
                    ],
                },
                {
                    id: 'cseu',
                    groups: [
                        { nodes: ['nsao', 'nrW1'], parentId: target_sibling },
                        {
                            nodes: [merged_child_1, merged_child_2],
                            parentId: merged,
                        },
                    ],
                },
            ],
            content: {
                nKnN: { content: '1' },
                nfaY: { content: '1.1' },
                nsao: { content: '1.1.1' },
                nrW1: { content: '1.1.2' },
                nlfk: { content: '2' },
                n2xm: { content: '2.1' },
                nquj: { content: '2.1.1' },
                naR2: { content: '2.1.2' },
                nqZO: { content: 'middle' },
            },
        };
        const action = {
            type: 'DOCUMENT/MERGE_NODE',
            payload: { direction: 'up', activeNodeId: merged },
        } as const;
        const output = {
            columns: [
                {
                    id: 'ctOc',
                    groups: [
                        {
                            nodes: [target_parent, merged_parent],
                            parentId: 'rvHb',
                        },
                    ],
                },
                {
                    id: 'cVkK',
                    groups: [
                        {
                            nodes: [target_sibling, target],
                            parentId: target_parent,
                        },
                    ],
                },
                {
                    id: 'cseu',
                    groups: [
                        { nodes: ['nsao', 'nrW1'], parentId: target_sibling },
                        {
                            nodes: [merged_child_1, merged_child_2],
                            parentId: target,
                        },
                    ],
                },
            ],
            content: {
                nKnN: { content: '1' },
                nfaY: { content: '1.1' },
                nsao: { content: '1.1.1' },
                nrW1: { content: '1.1.2' },
                nlfk: { content: '2' },
                nquj: { content: '2.1.1' },
                naR2: { content: '2.1.2' },
                nqZO: { content: 'middle\n2.1' },
            },
            state: {
                activeNode: target,
            },
        };
        mergeNode(input.columns, input.content, action);
        expect(input.columns).toEqual(output.columns);
        expect(input.content).toEqual(output.content);
    });
    test('bug: child groups are also merged', () => {
        const c0 = 'cDlw';
        const c1 = 'cJiB';
        const c2 = 'cs-i';
        const root = 'rpFV';
        const n1 = 'nsw-';
        const n1_1 = 'nXjA';
        const n1_1_1 = 'nQ56';
        const n2 = 'nVWc';
        const n2_1 = 'nHii';
        const n2_1_1 = 'nDCl';
        const n2_1_2 = 'nekl';

        const action = {
            type: 'DOCUMENT/MERGE_NODE',
            payload: { direction: 'up', activeNodeId: 'nVWc' },
        } as const;

        const input = {
            columns: [
                { id: c0, groups: [{ nodes: [n1, n2], parentId: root }] },
                {
                    id: c1,
                    groups: [
                        { nodes: [n1_1], parentId: n1 },
                        { nodes: [n2_1], parentId: n2 },
                    ],
                },
                {
                    id: c2,
                    groups: [
                        { nodes: [n1_1_1], parentId: n1_1 },
                        { nodes: [n2_1_1, n2_1_2], parentId: n2_1 },
                    ],
                },
            ],
            content: {
                [n1]: { content: '1' },
                [n1_1]: { content: '1.1' },
                [n1_1_1]: { content: '1.1.1' },
                [n2]: { content: '2' },
                [n2_1]: { content: '2.1' },
                [n2_1_1]: { content: '2.1.1' },
                [n2_1_2]: { content: '2.1.2' },
            },
        };

        const output = {
            columns: [
                { id: c0, groups: [{ nodes: [n1], parentId: root }] },
                { id: c1, groups: [{ nodes: [n1_1, n2_1], parentId: n1 }] },
                {
                    id: c2,
                    groups: [
                        { nodes: [n1_1_1], parentId: n1_1 },
                        { nodes: [n2_1_1, n2_1_2], parentId: n2_1 },
                    ],
                },
            ],
            content: {
                [n1]: { content: '1\n2' },
                [n1_1]: { content: '1.1' },
                [n1_1_1]: { content: '1.1.1' },
                [n2_1]: { content: '2.1' },
                [n2_1_1]: { content: '2.1.1' },
                [n2_1_2]: { content: '2.1.2' },
            },
        };
        mergeNode(input.columns, input.content, action);
        expect(input.columns).toEqual(output.columns);
        expect(input.content).toEqual(output.content);
    });
});
