import { extractFrontmatter } from 'src/view/helpers/extract-frontmatter';
import { describe, expect, it } from 'vitest';

describe('extractFrontmatter', () => {
    it('should correctly extract frontmatter when it exists', () => {
        const input = `---\ntitle: Example\ndate: 2024-02-27\n---\n# Content\nThis is the content of the markdown file.\n`;
        const { data, frontmatter } = extractFrontmatter(input);
        expect(data).toEqual(
            '# Content\nThis is the content of the markdown file.\n',
        );
        expect(frontmatter).toEqual(
            '---\ntitle: Example\ndate: 2024-02-27\n---',
        );
    });

    it('should return empty frontmatter when it does not exist', () => {
        const input = `# Content\nThis is the content of the markdown file.\n`;
        const { data, frontmatter } = extractFrontmatter(input);
        expect(data).toEqual(
            '# Content\nThis is the content of the markdown file.\n',
        );
        expect(frontmatter).toEqual('');
    });

    it('should handle empty input', () => {
        const { data, frontmatter } = extractFrontmatter('');
        expect(data).toEqual('');
        expect(frontmatter).toEqual('');
    });

    it('should handle input with only frontmatter', () => {
        const input = `---\ntitle: Only Frontmatter\n---\n`;
        const { data, frontmatter } = extractFrontmatter(input);
        expect(data).toEqual('');
        expect(frontmatter).toEqual('---\ntitle: Only Frontmatter\n---');
    });
});
