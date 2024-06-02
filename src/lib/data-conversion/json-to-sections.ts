import { TreeNode } from 'src/lib/data-conversion/columns-to-json';
import { delimiter, level } from 'src/lib/data-conversion/helpers/delimiter';

export const jsonToSections = (
    tree: TreeNode[],
    parentNumber = '',
    text = '',
    includeStructure = true,
) => {
    for (let i = 0; i < tree.length; i++) {
        const node = tree[i];
        const content = node.content;
        const index = i + 1;
        if (text) text = text + (includeStructure ? '\n' : '\n\n');
        if (includeStructure) {
            text += delimiter(parentNumber, index) + '\n' + content;
        } else {
            text += content;
        }
        if (node.children.length > 0) {
            text = jsonToSections(
                node.children,
                level(parentNumber, index),
                text,
                includeStructure,
            );
        }
    }
    return text;
};
