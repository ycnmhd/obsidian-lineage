import { describe, expect, test } from 'vitest';
import { outlineToSections } from 'src/lib/data-conversion/outline-to-sections';

describe('outline-to-sections', () => {
    test('simple outline', () => {
        const input = ['- 1', '\t- 1.1', '\t\t- 1.2', '- 2', '- 3', '\t- 3.1'];
        const output = `
<!--section: 1-->
1

<!--section: 1.1-->
1.1

<!--section: 1.1.1-->
1.2

<!--section: 2-->
2

<!--section: 3-->
3

<!--section: 3.1-->
3.1`;

        expect(outlineToSections(input.join('\n'))).toEqual(output);
    });
    test('has new lines', () => {
        const input = [
            '- 1',
            '\t- 1.1',
            '...',
            '...',
            '\t\t- 1.2',
            '...',
            '- 2',
            '\t\t - ...',
            '- 3',
            '\t- 3.1',
        ];
        const output = `
<!--section: 1-->
1

<!--section: 1.1-->
1.1
...
...

<!--section: 1.1.1-->
1.2
...

<!--section: 2-->
2
\t\t - ...

<!--section: 3-->
3

<!--section: 3.1-->
3.1`;

        expect(outlineToSections(input.join('\n'))).toEqual(output);
    });
    test('has a section', () => {
        const input = [
            '- 1',
            '\t- 1.1',
            '<!--section: 1.2-->',
            '\t\t- 1.2',
            '- 2',
            '- 3',
            '\t- 3.1',
        ];
        expect(() => outlineToSections(input.join('\n'))).toThrowError(
            'input has a section',
        );
    });
});
