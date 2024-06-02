import { TreeNode } from 'src/lib/data-conversion/columns-to-json';
import { jsonToSections } from 'src/lib/data-conversion/json-to-sections';

export const jsonToText = (nodes: TreeNode[]): string => {
    return jsonToSections(nodes, undefined, undefined, false);
};
