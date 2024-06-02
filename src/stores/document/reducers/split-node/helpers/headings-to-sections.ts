import { headingsToJson } from 'src/stores/document/reducers/split-node/helpers/headings-to-json';
import { jsonToMarkdown } from 'src/stores/view/helpers/json-to-md/json-to-makdown/json-to-markdown';

export const headingsToSections = (input: string): string => {
    const tree = headingsToJson(input);
    if (tree.length === 1 && tree[0].children.length === 0) return input;
    return jsonToMarkdown(tree);
};
