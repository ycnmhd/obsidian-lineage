export const extractFrontmatter = (
    markdown: string,
): { data: string; frontmatter: string } => {
    const frontmatterRegex = /^---\n([\s\S]+?)\n---\n/;
    const match = markdown.match(frontmatterRegex);

    if (match) {
        const frontmatter = match[0];
        const data = markdown.slice(frontmatter.length);
        return { data, frontmatter: frontmatter.trim() };
    } else {
        return { data: markdown, frontmatter: '' };
    }
};
