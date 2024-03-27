import { describe, expect, it } from 'vitest';
import { LineageDocument } from 'src/stores/document/document-state-type';
import { updateActiveBranch } from 'src/stores/view/reducers/document/helpers/update-active-branch';
import { ActiveBranch } from 'src/stores/view/default-view-state';

describe('update-tree-state', () => {
    it('case 1', () => {
        const activeNodeId = 'n-lt8upk0l';

        const child1 = 'n-lt8upk0n';
        const child2 = 'n-lt8upk0p';
        const child3 = 'n-lt8upk0q';
        const child4 = 'n-lt8upk0r';
        const child4_1 = 'n-lt8upk0s';
        const col = 'c-lt8upk0m';
        const document = {
            content: {
                'n-lt8upk0l': { content: '' },
                'n-lt8upk0n': { content: '' },
                'n-lt8upk0p': { content: '' },
                'n-lt8upk0q': { content: '' },
                'n-lt8upk0r': { content: '' },
                'n-lt8upk0s': { content: '' },
                'n-lt8upk0u': { content: '' },
                'n-lt8upk0v': { content: '' },
                'n-lt8upk0w': { content: '' },
                'n-lt8upk0x': { content: '' },
                'n-lt8upk0y': { content: '' },
                'n-lt8upk0z': { content: '' },
                'n-lt8upk10': { content: '' },
                'n-lt8upk11': { content: '' },
                'n-lt8upk12': { content: '' },
                'n-lt8upk13': { content: '' },
            },
            columns: [
                {
                    id: col,
                    groups: [
                        {
                            nodes: [
                                activeNodeId,
                                'n-lt8upk0u',
                                'n-lt8upk0v',
                                'n-lt8upk0z',
                                'n-lt8upk10',
                                'n-lt8upk11',
                                'n-lt8upk12',
                                'n-lt8upk13',
                            ],
                            parentId: 'r-lt8upk0k',
                        },
                    ],
                },
                {
                    id: 'c-lt8upk0o',
                    groups: [
                        {
                            nodes: [child1, child2, child3, child4],
                            parentId: activeNodeId,
                        },
                        { nodes: ['n-lt8upk0w'], parentId: 'n-lt8upk0v' },
                    ],
                },
                {
                    id: 'c-lt8upk0t',
                    groups: [
                        { nodes: [child4_1], parentId: child4 },
                        {
                            nodes: ['n-lt8upk0x', 'n-lt8upk0y'],
                            parentId: 'n-lt8upk0w',
                        },
                    ],
                },
            ],
            state: {
                activeNode: activeNodeId,
            },
        };
        const input = {
            document: document satisfies LineageDocument,
            activeBranch: {
                childGroups: new Set([]),
                sortedParentNodes: [],
                group: 'r-lt8upk0k',
                column: col,
            } satisfies ActiveBranch,
        };

        const output = {
            document: document satisfies LineageDocument,
            activeBranch: {
                childGroups: new Set([activeNodeId, child4]),
                sortedParentNodes: [],
                group: 'r-lt8upk0k',
                column: col,
            } satisfies ActiveBranch,
        };
        updateActiveBranch(
            input.activeBranch,
            activeNodeId,
            input.document.columns,
        );
        expect(input.activeBranch).toEqual(output.activeBranch);
    });
});
