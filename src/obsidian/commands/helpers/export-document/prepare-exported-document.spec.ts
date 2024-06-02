import { describe, expect, test } from 'vitest';
import { prepareExportedDocument } from 'src/obsidian/commands/helpers/export-document/prepare-exported-document';

describe('prepare exported document', () => {
    test('base test', () => {
        const input = [
            '<!--section: 1-->',
            '# 1',
            '...',
            '<!--section: 2-->',
            '# 2',
            '...',
        ].join('\n');
        const output = `- # 1
  ...
- # 2
  ...`;
        expect(prepareExportedDocument(input, 'test', 'outline')).toEqual(
            output,
        );
    });
    test('should handle frontmatter', () => {
        const input = [
            '---',
            'created: 2024-06-02T09:05',
            'updated: 2024-06-02T09:44',
            '---',
            '',
            '<!--section: 1-->',
            '# 1',
            '...',
            '<!--section: 2-->',
            '# 2',
            '...',
        ].join('\n');
        const output = `---
created: 2024-06-02T09:05
updated: 2024-06-02T09:44
---

- # 1
  ...
- # 2
  ...`;
        expect(prepareExportedDocument(input, 'test', 'outline')).toEqual(
            output,
        );
    });
});
