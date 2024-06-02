import { describe, expect, it } from 'vitest';
import { ginkgo_academic_paper } from 'src/lib/data-conversion/test-data/ginkgo_acedemic_paper';
import { jsonToText } from 'src/lib/data-conversion/json-to-text';
import { ginkgo_welcome } from 'src/lib/data-conversion/test-data/ginkgo_welcome';

describe('json-to-text', () => {
    it('ginkgo_welcome', () => {
        const { md, json } = ginkgo_welcome;
        const actual = jsonToText(json);
        expect(actual).toEqual(md);
    });
    it('exported ginkgo_academic_paper', () => {
        const { md, json } = ginkgo_academic_paper;
        const actual = jsonToText(json);
        expect(actual).toEqual(md);
    });
});
