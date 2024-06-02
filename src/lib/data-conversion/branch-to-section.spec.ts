import { describe, expect, test } from 'vitest';
import { ClipboardBranch } from 'src/stores/document/document-state-type';
import { branchToSection } from 'src/lib/data-conversion/branch-to-section';

describe('branch-to-section', () => {
    test('case 1', () => {
        const n1_1 = 'nhHt';
        const n1_2 = 'nQUN';
        const n1_1_1 = 'n0hL';
        const n1_1_2 = 'n3AK';
        const n1_2_1 = 'nU3O';
        const n1_2_2 = 'n97l';
        const n1_1_2_1 = 'nNIa';
        const n1 = 'nBoi';
        const branch: ClipboardBranch = {
            sortedChildGroups: [
                [{ nodes: [n1_1, n1_2], parentId: n1 }],
                [
                    { nodes: [n1_1_1, n1_1_2], parentId: n1_1 },
                    { nodes: [n1_2_1, n1_2_2], parentId: n1_2 },
                ],
                [{ nodes: [n1_1_2_1], parentId: n1_1_2 }],
            ],
            content: {
                [n1_1]: { content: '1.1' },
                [n1_2]: { content: '1.2' },
                [n1_1_1]: { content: '1.1.1' },
                [n1_1_2]: { content: '1.1.2' },
                [n1_2_1]: { content: '1.2.1' },
                [n1_2_2]: { content: '1.2.2' },
                [n1_1_2_1]: { content: '1.1.2.1' },
                [n1]: { content: '1' },
            },
            nodeId: n1,
            mode: 'copy',
        };
        const text = `\n<!--section: 1-->\n1\n\n<!--section: 1.1-->\n1.1\n\n<!--section: 1.1.1-->\n1.1.1\n\n<!--section: 1.1.2-->\n1.1.2\n\n<!--section: 1.1.2.1-->\n1.1.2.1\n\n<!--section: 1.2-->\n1.2\n\n<!--section: 1.2.1-->\n1.2.1\n\n<!--section: 1.2.2-->\n1.2.2`;
        expect(branchToSection(branch)).toEqual(text);
    });
});
