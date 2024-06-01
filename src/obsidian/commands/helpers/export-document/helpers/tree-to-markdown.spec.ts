import { describe, expect, test } from 'vitest';
import { ginkgo_academic_paper } from 'src/stores/view/helpers/json-to-md/json-to-makdown/data/ginkgo_acedemic_paper';
import { treeToMarkdown } from 'src/obsidian/commands/helpers/export-document/helpers/tree-to-markdown';

describe('tree-to-markdown', () => {
    test('generic document', () => {
        const input = ginkgo_academic_paper.json;
        const output = ginkgo_academic_paper.md;
        expect(treeToMarkdown(input)).toEqual(output);
    });
});
