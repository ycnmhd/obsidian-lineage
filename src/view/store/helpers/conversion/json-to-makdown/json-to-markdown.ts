import { TreeNode } from 'src/view/store/helpers/conversion/columns-to-json/columns-to-json-tree';
import {
    delimiter,
    level,
} from 'src/view/store/helpers/conversion/markdown-to-json/helpers/delimiter';

export const jsonToMarkdown = (
    tree: TreeNode[],
    parentNumber = '',
    text = '',
) => {
    for (let i = 0; i < tree.length; i++) {
        const node = tree[i];
        const content = node.content;
        const index = i + 1;
        if (text) text = text + '\n';
        text += delimiter(parentNumber, index) + '\n' + content;
        if (node.children.length > 0) {
            text = jsonToMarkdown(
                node.children,
                level(parentNumber, index),
                text,
            );
        }
    }
    return text;
};
