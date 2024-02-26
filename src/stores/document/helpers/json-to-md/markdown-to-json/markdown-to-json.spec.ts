import { describe, expect, it } from 'vitest';
import { delimiter } from 'src/stores/document/helpers/json-to-md/markdown-to-json/helpers/delimiter';
import { markdownToJson } from 'src/stores/document/helpers/json-to-md/markdown-to-json/markdown-to-json';

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

    it('case 2', () => {
        const input = `<!--section: 1-->


<!--section: 2-->


<!--section: 2.1-->


<!--section: 2.2-->


<!--section: 2.3-->`;

        const output = [
            { content: '', children: [] },
            {
                content: '',
                children: [
                    { content: '', children: [] },

                    { content: '', children: [] },
                    { content: '', children: [] },
                ],
            },
        ];
        const actual = markdownToJson(input);
        expect(actual).toEqual(output);
    });
    it('text with no sections', () => {
        const output = [{ content: 'text', children: [] }];
        const actual = markdownToJson('text');
        expect(actual).toEqual(output);
    });
    it('text above sections', () => {
        const output = [
            { content: 'text 1', children: [] },
            { content: 'text 2', children: [] },
        ];
        const actual = markdownToJson(
            [`text 1`, `<!--section: 1-->`, 'text 2'].join('\n'),
        );
        expect(actual).toEqual(output);
    });
});
