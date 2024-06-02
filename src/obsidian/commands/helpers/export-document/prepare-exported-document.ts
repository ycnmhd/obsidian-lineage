import { extractFrontmatter } from 'src/view/helpers/extract-frontmatter';
import { sectionsToJson } from 'src/lib/data-conversion/sections-to-json';
import { jsonToOutline } from 'src/lib/data-conversion/json-to-outline';
import { jsonToText } from 'src/lib/data-conversion/json-to-text';
import { ExportMode } from 'src/obsidian/commands/helpers/export-document/export-document';

export const prepareExportedDocument = (
    fileData: string,
    basename: string,
    mode: ExportMode,
) => {
    const { data, frontmatter } = extractFrontmatter(fileData);
    const tree = sectionsToJson(data);
    if (tree.length < 2 && tree[0].children.length == 0) {
        throw new Error(`File ${basename} does not appear to be a tree`);
    }
    return (
        (frontmatter ? frontmatter + '\n' : '') +
        (mode === 'outline' ? jsonToOutline(tree) : jsonToText(tree))
    );
};
