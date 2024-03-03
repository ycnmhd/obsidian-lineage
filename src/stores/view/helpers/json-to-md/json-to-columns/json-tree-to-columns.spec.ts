import { describe, expect, it } from 'vitest';
import { TreeNode } from 'src/stores/view/helpers/json-to-md/columns-to-json/columns-to-json-tree';
import { jsonTreeToColumns } from 'src/stores/view/helpers/json-to-md/json-to-columns/json-tree-to-columns';
import { StatelessDocument } from 'src/stores/view/view-state-type';

type Expect = typeof expect;

export const __compareColumns__ = (
    documentA: StatelessDocument,
    documentB: StatelessDocument,
    expect: Expect,
) => {
    expect(documentA.columns.length).toEqual(documentB.columns.length);
    const contentA = documentA.content;
    const contentB = documentB.content;
    expect(Object.values(contentA)).toEqual(Object.values(contentB));
    const columnsA = documentA.columns;
    const columnsB = documentB.columns;

    expect(columnsA.length, 'columns length').toEqual(columnsB.length);
    for (let columnI = 0; columnI < columnsA.length; columnI++) {
        const c_a = columnsA[columnI];
        const c_b = columnsB[columnI];
        expect(c_a.groups.length, `groups length of column ${columnI}`).toEqual(
            c_b.groups.length,
        );
        for (let groupI = 0; groupI < c_a.groups.length; groupI++) {
            const g_a = c_a.groups[groupI];
            const g_b = c_b.groups[groupI];
            expect(g_a.nodes.length, `nodes number of group ${groupI}`).toEqual(
                g_b.nodes.length,
            );
            for (let nodeI = 0; nodeI < g_a.nodes.length; nodeI++) {
                const n_a = g_a.nodes[nodeI];
                const n_b = g_b.nodes[nodeI];
                expect(
                    contentA[n_a]?.content,
                    `node content of node ${nodeI}`,
                ).toEqual(contentB[n_b]?.content);
            }
        }
    }
};

describe('tree-to-columns', () => {
    it('case', () => {
        const tree = [
            { content: 'one', children: [] },
            {
                content: 'two',
                children: [
                    { content: 'three', children: [] },
                    {
                        content: 'four',
                        children: [
                            { content: 'five', children: [] },
                            { content: 'six', children: [] },
                            { content: 'seven', children: [] },
                        ],
                    },
                ],
            },
        ] satisfies TreeNode[];
        const document = {
            content: {
                'n-lt8xujad': { content: 'one' },
                'n-lt8xujaf': { content: 'two' },
                'n-lt8xujag': { content: 'three' },
                'n-lt8xujai': { content: 'four' },
                'n-lt8xujaj': { content: 'five' },
                'n-lt8xujal': { content: 'six' },
                'n-lt8xujam': { content: 'seven' },
            },
            columns: [
                {
                    id: 'c-lt8xujae',
                    groups: [
                        {
                            nodes: ['n-lt8xujad', 'n-lt8xujaf'],
                            parentId: 'r-lt8xujac',
                        },
                    ],
                },
                {
                    id: 'c-lt8xujah',
                    groups: [
                        {
                            nodes: ['n-lt8xujag', 'n-lt8xujai'],
                            parentId: 'n-lt8xujaf',
                        },
                    ],
                },
                {
                    id: 'c-lt8xujak',
                    groups: [
                        {
                            nodes: ['n-lt8xujaj', 'n-lt8xujal', 'n-lt8xujam'],
                            parentId: 'n-lt8xujai',
                        },
                    ],
                },
            ],
        } satisfies StatelessDocument;
        __compareColumns__(jsonTreeToColumns(tree), document, expect);
    });
});
