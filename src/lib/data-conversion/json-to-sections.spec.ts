import { describe, expect, it } from 'vitest';
import { TreeNode } from 'src/lib/data-conversion/columns-to-json';
import { jsonToSections } from 'src/lib/data-conversion/json-to-sections';
import { delimiter } from 'src/lib/data-conversion/helpers/delimiter';

describe('json to sections', () => {
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
        expect(jsonToSections(input)).toEqual(output.join('\n'));
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
        expect(jsonToSections(input)).toEqual(output.join('\n'));
    });
});
