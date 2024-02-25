import { describe, expect, it } from 'vitest';
import { TreeNode } from 'src/stores/document/helpers/json-to-md/columns-to-json/columns-to-json-tree';
import { jsonToMarkdown } from 'src/stores/document/helpers/json-to-md/json-to-makdown/json-to-markdown';
import { delimiter } from 'src/stores/document/helpers/json-to-md/markdown-to-json/helpers/delimiter';

describe('json to markdown', () => {
    it('case 1', () => {
        const input: TreeNode[] = [
            {
                content: 'one',
                children: [{ content: 'one > one', children: [] }],
            },
        ];
        const output = [
            delimiter('', 1),
            'one',
            delimiter('1', 1),
            'one > one',
        ];
        expect(jsonToMarkdown(input)).toEqual(output.join('\n'));
    });
    it('case 1', () => {
        const input: TreeNode[] = [
            {
                content: 'one',
                children: [
                    {
                        content: 'one > one',
                        children: [
                            { content: 'one > one > one', children: [] },
                        ],
                    },
                ],
            },
            {
                content: 'two',
                children: [
                    {
                        content: 'two > one',
                        children: [
                            { content: 'two > one > one', children: [] },
                        ],
                    },
                ],
            },
        ];
        const output = [
            delimiter('', 1),
            'one',
            delimiter('1', 1),
            'one > one',
            delimiter('1.1', 1),
            'one > one > one',
            delimiter('', 2),
            'two',
            delimiter('2', 1),
            'two > one',
            delimiter('2.1', 1),
            'two > one > one',
        ];
        expect(jsonToMarkdown(input)).toEqual(output.join('\n'));
    });
});
