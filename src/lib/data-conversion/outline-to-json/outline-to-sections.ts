import { jsonToMarkdown } from 'src/stores/view/helpers/json-to-md/json-to-makdown/json-to-markdown';
import { outlineToJson } from 'src/lib/data-conversion/outline-to-json/outilne-to-json';

export const outlineToSections = (input: string): string => {
    const tree = outlineToJson(input);
    if (tree.length === 1 && tree[0].children.length === 0) return input;
    return jsonToMarkdown(tree);
};
