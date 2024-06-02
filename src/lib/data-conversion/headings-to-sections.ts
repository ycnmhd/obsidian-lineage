import { headingsToJson } from 'src/lib/data-conversion/headings-to-json';
import { jsonToSections } from 'src/lib/data-conversion/json-to-sections';

export const headingsToSections = (input: string): string => {
    const tree = headingsToJson(input);
    if (tree.length === 1 && tree[0].children.length === 0) return input;
    return jsonToSections(tree);
};
