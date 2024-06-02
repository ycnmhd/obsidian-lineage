import { describe, expect, it } from 'vitest';
import { delimiter } from 'src/lib/data-conversion/helpers/delimiter';
import { sectionsToJson } from 'src/lib/data-conversion/sections-to-json';
import { ginkgo_welcome } from 'src/lib/data-conversion/test-data/ginkgo_welcome';
import { ginkgo_academic_paper } from 'src/lib/data-conversion/test-data/ginkgo_acedemic_paper';

describe('sections to json', () => {
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
        const actual = sectionsToJson(input.join('\n'));
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
        const actual = sectionsToJson(input);
        expect(actual).toEqual(output);
    });
    it('text with no sections', () => {
        const output = [{ content: 'text', children: [] }];
        const actual = sectionsToJson('text');
        expect(actual).toEqual(output);
    });
    it('text above sections', () => {
        const output = [
            { content: 'text 1', children: [] },
            { content: 'text 2', children: [] },
        ];
        const actual = sectionsToJson(
            [`text 1`, `<!--section: 1-->`, 'text 2'].join('\n'),
        );

        expect(actual).toEqual(output);
    });
    it('bug 24-02-28', () => {
        const input = `
<!--section: 1-->
text 1

<!--section: 1.1-->
text 2

<!--section: 1.1.1-->
text 3

<!--section: 1.2-->
text 6

<!--section: 2-->
text 7`;
        const output = [
            {
                content: 'text 1',
                children: [
                    {
                        content: 'text 2',
                        children: [
                            { content: 'text 3', children: [] },
                            /*   { content: 'text 4', children: [] },
                            { content: 'text 5', children: [] },*/
                        ],
                    },
                    { content: 'text 6', children: [] },
                ],
            },

            { content: 'text 7', children: [] },
        ];

        const actual = sectionsToJson(input);
        expect(actual).toEqual(output);
    });

    it('ginkgo_welcome', () => {
        const { annotatedMd, json } = ginkgo_welcome;
        const actual = sectionsToJson(annotatedMd);
        expect(actual).toEqual(json);
    });

    it('ginkgo_academic_paper', () => {
        const { annotatedMd, json } = ginkgo_academic_paper;
        const actual = sectionsToJson(annotatedMd);
        expect(actual).toEqual(json);
    });
});
