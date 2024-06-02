import { describe, expect, test } from 'vitest';
import { splitNode } from 'src/stores/document/reducers/split-node/split-node';
import { compareDocuments } from 'src/helpers/test-helpers/compare-documents';
import { clone } from 'src/helpers/clone';
import { lang } from 'src/lang/lang';

describe('split node', () => {
    test('case: generic document', () => {
        const n1 = 'n-1';
        const input = {
            columns: [
                {
                    id: 'cHO72UZ2a',
                    groups: [
                        { nodes: [n1, 'nP3BBw00m'], parentId: 'r6ulJnzt1' },
                    ],
                },
            ],
            content: {
                nP3BBw00m: {
                    content:
                        '# 1\n..\n..\n..\n\n## 1.1\n..\n..\n..\n\n## 1.2\n..\n..\n\n### 1.2.1\n..\n..\n\n## 1.3\n..\n..\n\n### 1.3.1\n..\n..\n\n### 1.3.2\n..\n..\n\n#### 1.3.2.1\n..\n..\n\n#### 1.3.2.2\n..\n..\n\n##### 1.3.2.2.1\n..\n..\n\n##### 1.3.2.2.2\n..\n..\n\n# 2\n..\n..\n..\n\n## 2.1\n..\n..\n\n## 2.2\n..\n..\n\n### 2.2.1\n..\n..\n\n### 2.2.2\n..\n..\n\n#### 2.2.2.1\n..\n..\n\n#### 2.2.2.2\n..\n..\n\n##### 2.2.2.2.1\n..\n..\n\n##### 2.2.2.2.2\n..\n..\n\n# 3\n..\n..\n..\n\n## 3.1\n..\n..\n\n## 3.2\n..\n..\n\n### 3.2.1\n..\n..\n\n### 3.2.2\n..\n..\n\n#### 3.2.2.1\n..\n..\n\n#### 3.2.2.2\n..\n..\n\n##### 3.2.2.2.1\n..\n..\n\n##### 3.2.2.2.2\n..\n..\n\n# 4\n..\n..\n..\n\n## 4.1\n..\n..\n\n## 4.2\n..\n..\n\n### 4.2.1\n..\n..\n\n### 4.2.2\n..\n..\n\n#### 4.2.2.1\n..\n..\n\n#### 4.2.2.2\n..\n..\n\n##### 4.2.2.2.1\n..\n..\n\n##### 4.2.2.2.2\n..\n..\n\n# 5\n..\n..\n..\n\n## 5.1\n..\n..\n\n## 5.2\n..\n..\n\n### 5.2.1\n..\n..\n\n### 5.2.2\n..\n..\n\n#### 5.2.2.1\n..\n..\n\n#### 5.2.2.2\n..\n..\n\n##### 5.2.2.2.1\n..\n..\n\n##### 5.2.2.2.2\n..\n..',
                },
                [n1]: { content: '1' },
            },
        };
        const action = {
            type: 'DOCUMENT/SPLIT_NODE',
            payload: { target: 'nP3BBw00m', mode: 'heading' },
        } as const;
        const output = {
            columns: [
                {
                    id: 'cHO72UZ2a',
                    groups: [
                        {
                            nodes: [
                                n1,
                                'nJvoFPcJT',
                                'nAm5yU2YP',
                                'noVusSgkA',
                                'nDcmcF1pK',
                                'n4-VRq-aR',
                            ],
                            parentId: 'r6ulJnzt1',
                        },
                    ],
                },
                {
                    id: 'cMN_8DzZt',
                    groups: [
                        {
                            nodes: ['nviWx-Jsc', 'nemIDFtX6', 'nofcdyGU2'],
                            parentId: 'nJvoFPcJT',
                        },
                        {
                            nodes: ['nW5ycasSb', 'n4wDFINID'],
                            parentId: 'nAm5yU2YP',
                        },
                        {
                            nodes: ['n8GvSQxjl', 'nzNlrMWrl'],
                            parentId: 'noVusSgkA',
                        },
                        {
                            nodes: ['nTaVzvDNl', 'nUfxiJceh'],
                            parentId: 'nDcmcF1pK',
                        },
                        {
                            nodes: ['noo6K9O0I', 'ns5Nc0GZp'],
                            parentId: 'n4-VRq-aR',
                        },
                    ],
                },
                {
                    id: 'cxvkT8pAZ',
                    groups: [
                        { nodes: ['nu-eU8m0f'], parentId: 'nemIDFtX6' },
                        {
                            nodes: ['nVnD14dBa', 'ntMCP-fyP'],
                            parentId: 'nofcdyGU2',
                        },
                        {
                            nodes: ['nbuO-B1uM', 'ns9c6WX9k'],
                            parentId: 'n4wDFINID',
                        },
                        {
                            nodes: ['nWXZFfdp7', 'ndxLAimFm'],
                            parentId: 'nzNlrMWrl',
                        },
                        {
                            nodes: ['nDm6E3N68', 'nax3uRpBE'],
                            parentId: 'nUfxiJceh',
                        },
                        {
                            nodes: ['nVtqug1I6', 'nkcVMZaAJ'],
                            parentId: 'ns5Nc0GZp',
                        },
                    ],
                },
                {
                    id: 'c63xvnBV7',
                    groups: [
                        {
                            nodes: ['nysvltjFU', 'nycUHQiHB'],
                            parentId: 'ntMCP-fyP',
                        },
                        {
                            nodes: ['nHe1EW7VU', 'nyvDmIcPD'],
                            parentId: 'ns9c6WX9k',
                        },
                        {
                            nodes: ['nksNf2w3g', 'nutNc7Uqs'],
                            parentId: 'ndxLAimFm',
                        },
                        {
                            nodes: ['ndlz-YVAD', 'nUj7wOpBm'],
                            parentId: 'nax3uRpBE',
                        },
                        {
                            nodes: ['nCPMtImyM', 'nf4ZiIC8g'],
                            parentId: 'nkcVMZaAJ',
                        },
                    ],
                },
                {
                    id: 'c47BPfAqt',
                    groups: [
                        {
                            nodes: ['nJgSgAPW9', 'nPSrUoHTW'],
                            parentId: 'nycUHQiHB',
                        },
                        {
                            nodes: ['n6B6zRrR-', 'nAmaAFRwi'],
                            parentId: 'nyvDmIcPD',
                        },
                        {
                            nodes: ['nNQDELnum', 'nIrcAFWAZ'],
                            parentId: 'nutNc7Uqs',
                        },
                        {
                            nodes: ['nwLsqze0D', 'ndmOtvUuv'],
                            parentId: 'nUj7wOpBm',
                        },
                        {
                            nodes: ['nrJsIf5kG', 'nkZTZQPJV'],
                            parentId: 'nf4ZiIC8g',
                        },
                    ],
                },
            ],
            content: {
                [n1]: { content: '1' },
                'n4-VRq-aR': { content: '# 5\n..\n..\n..' },
                noo6K9O0I: { content: '## 5.1\n..\n..' },
                ns5Nc0GZp: { content: '## 5.2\n..\n..' },
                nVtqug1I6: { content: '### 5.2.1\n..\n..' },
                nkcVMZaAJ: { content: '### 5.2.2\n..\n..' },
                nCPMtImyM: { content: '#### 5.2.2.1\n..\n..' },
                nf4ZiIC8g: { content: '#### 5.2.2.2\n..\n..' },
                nrJsIf5kG: { content: '##### 5.2.2.2.1\n..\n..' },
                nkZTZQPJV: { content: '##### 5.2.2.2.2\n..\n..' },
                nDcmcF1pK: { content: '# 4\n..\n..\n..' },
                nTaVzvDNl: { content: '## 4.1\n..\n..' },
                nUfxiJceh: { content: '## 4.2\n..\n..' },
                nDm6E3N68: { content: '### 4.2.1\n..\n..' },
                nax3uRpBE: { content: '### 4.2.2\n..\n..' },
                'ndlz-YVAD': { content: '#### 4.2.2.1\n..\n..' },
                nUj7wOpBm: { content: '#### 4.2.2.2\n..\n..' },
                nwLsqze0D: { content: '##### 4.2.2.2.1\n..\n..' },
                ndmOtvUuv: { content: '##### 4.2.2.2.2\n..\n..' },
                noVusSgkA: { content: '# 3\n..\n..\n..' },
                n8GvSQxjl: { content: '## 3.1\n..\n..' },
                nzNlrMWrl: { content: '## 3.2\n..\n..' },
                nWXZFfdp7: { content: '### 3.2.1\n..\n..' },
                ndxLAimFm: { content: '### 3.2.2\n..\n..' },
                nksNf2w3g: { content: '#### 3.2.2.1\n..\n..' },
                nutNc7Uqs: { content: '#### 3.2.2.2\n..\n..' },
                nNQDELnum: { content: '##### 3.2.2.2.1\n..\n..' },
                nIrcAFWAZ: { content: '##### 3.2.2.2.2\n..\n..' },
                nAm5yU2YP: { content: '# 2\n..\n..\n..' },
                nW5ycasSb: { content: '## 2.1\n..\n..' },
                n4wDFINID: { content: '## 2.2\n..\n..' },
                'nbuO-B1uM': { content: '### 2.2.1\n..\n..' },
                ns9c6WX9k: { content: '### 2.2.2\n..\n..' },
                nHe1EW7VU: { content: '#### 2.2.2.1\n..\n..' },
                nyvDmIcPD: { content: '#### 2.2.2.2\n..\n..' },
                'n6B6zRrR-': { content: '##### 2.2.2.2.1\n..\n..' },
                nAmaAFRwi: { content: '##### 2.2.2.2.2\n..\n..' },
                nJvoFPcJT: { content: '# 1\n..\n..\n..' },
                'nviWx-Jsc': { content: '## 1.1\n..\n..\n..' },
                nemIDFtX6: { content: '## 1.2\n..\n..' },
                nofcdyGU2: { content: '## 1.3\n..\n..' },
                'nu-eU8m0f': { content: '### 1.2.1\n..\n..' },
                nVnD14dBa: { content: '### 1.3.1\n..\n..' },
                'ntMCP-fyP': { content: '### 1.3.2\n..\n..' },
                nysvltjFU: { content: '#### 1.3.2.1\n..\n..' },
                nycUHQiHB: { content: '#### 1.3.2.2\n..\n..' },
                nJgSgAPW9: { content: '##### 1.3.2.2.1\n..\n..' },
                nPSrUoHTW: { content: '##### 1.3.2.2.2\n..\n..' },
            },
        };
        splitNode(input, action);
        expect(compareDocuments(input, output)).toBe(true);
    });

    test('case: should not split a card that has children', () => {
        const input = {
            columns: [
                {
                    id: 'cGwVLbC6g',
                    groups: [
                        {
                            parentId: 'rbeGusrhw',
                            nodes: ['nO5aXT_Tq', 'nPIgi1W6y'],
                        },
                    ],
                },
                {
                    id: 'cuBjVO7vR',
                    groups: [{ nodes: ['nD0DTdDwv'], parentId: 'nO5aXT_Tq' }],
                },
            ],
            content: {
                nO5aXT_Tq: { content: '# 1\n\n# 2' },
                nD0DTdDwv: { content: '# 1.1' },
                nPIgi1W6y: { content: '...' },
            },
        };
        const inputClone = clone(input);
        const action = {
            type: 'DOCUMENT/SPLIT_NODE',
            payload: { target: 'nO5aXT_Tq', mode: 'heading' },
        } as const;

        expect(() => splitNode(input, action)).toThrow(
            lang.cant_split_card_that_has_children,
        );
        expect(compareDocuments(input, inputClone)).toBe(true);
    });

    test('case: has siblings', () => {
        const input = {
            columns: [
                {
                    id: 'cGwVLbC6g',
                    groups: [
                        {
                            parentId: 'rbeGusrhw',
                            nodes: ['ndvsswQT5', 'nO5aXT_Tq', 'nPIgi1W6y'],
                        },
                    ],
                },
                {
                    id: 'cRcW8TfFe',
                    groups: [
                        { nodes: ['nL3pB2j4i'], parentId: 'ndvsswQT5' },
                        { nodes: ['nZ8LtQwaN'], parentId: 'nPIgi1W6y' },
                    ],
                },
            ],
            content: {
                nO5aXT_Tq: { content: '# 1\n...\n# 2\n...\n...\n## 2.1\n...' },
                nPIgi1W6y: { content: '# 3' },
                nZ8LtQwaN: { content: '## 3.1' },
                ndvsswQT5: { content: '# 0' },
                nL3pB2j4i: { content: '## 0.1' },
            },
        };
        const action = {
            type: 'DOCUMENT/SPLIT_NODE',
            payload: { target: 'nO5aXT_Tq', mode: 'heading' },
        } as const;
        const output = {
            columns: [
                {
                    id: 'cGwVLbC6g',
                    groups: [
                        {
                            parentId: 'rbeGusrhw',
                            nodes: [
                                'ndvsswQT5',
                                'ndAPRmby1',
                                'n2FWEMA4c',
                                'nPIgi1W6y',
                            ],
                        },
                    ],
                },
                {
                    id: 'cRcW8TfFe',
                    groups: [
                        { nodes: ['nL3pB2j4i'], parentId: 'ndvsswQT5' },
                        { nodes: ['nXtIacGo_'], parentId: 'n2FWEMA4c' },
                        { nodes: ['nZ8LtQwaN'], parentId: 'nPIgi1W6y' },
                    ],
                },
            ],
            content: {
                nPIgi1W6y: { content: '# 3' },
                nZ8LtQwaN: { content: '## 3.1' },
                ndvsswQT5: { content: '# 0' },
                nL3pB2j4i: { content: '## 0.1' },
                n2FWEMA4c: { content: '# 2\n...\n...' },
                nXtIacGo_: { content: '## 2.1\n...' },
                ndAPRmby1: { content: '# 1\n...' },
            },
        };
        splitNode(input, action);
        expect(compareDocuments(input, output)).toBe(true);
    });

    test('case: has no hierarchy', () => {
        const input = {
            columns: [
                {
                    id: 'cA93PIzXb',
                    groups: [{ nodes: ['nVPwysBOU'], parentId: 'rIfTAQybD' }],
                },
            ],
            content: { nVPwysBOU: { content: '# 1' } },
        };
        const inputClone = clone(input);
        const action = {
            type: 'DOCUMENT/SPLIT_NODE',
            payload: { target: 'nVPwysBOU', mode: 'heading' },
        } as const;

        expect(() => splitNode(input, action)).toThrow(lang.cant_split_card);
        expect(compareDocuments(input, inputClone)).toBe(true);
    });

    test('case: has a section annotation', () => {
        const input = {
            columns: [
                {
                    id: 'cA93PIzXb',
                    groups: [{ nodes: ['nVPwysBOU'], parentId: 'rIfTAQybD' }],
                },
            ],
            content: {
                nVPwysBOU: { content: '# 1\n## 1.1\n<!-- section: 1-->\n' },
            },
        };

        const inputClone = clone(input);
        const action = {
            type: 'DOCUMENT/SPLIT_NODE',
            payload: { target: 'nVPwysBOU', mode: 'heading' },
        } as const;

        expect(() => splitNode(input, action)).toThrow('input has a section');
        expect(compareDocuments(input, inputClone)).toBe(true);
    });
});
