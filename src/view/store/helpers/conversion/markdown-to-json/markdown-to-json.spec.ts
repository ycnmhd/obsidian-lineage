import { describe, expect, it } from 'vitest';
import { delimiter } from 'src/view/store/helpers/conversion/markdown-to-json/helpers/delimiter';
import { markdownToJson } from 'src/view/store/helpers/conversion/markdown-to-json/markdown-to-json';

describe('markdown to json', () => {
    it('case', () => {
        let index = 1;
        let index2 = 1;
        const input = [
            // '',
            delimiter('', index++),
            'one',
            delimiter('1', index2++),
            'one > two',
            delimiter('', index++),
            'two',
        ];

        const output = [
            {
                content: 'one',
                children: [{ content: 'one > two', children: [] }],
            },
            {
                content: 'two',
                children: [],
            },
        ];
        const actual = markdownToJson(input.join('\n'));
        expect(actual).toEqual(output);
    });
});
