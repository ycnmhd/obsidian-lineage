import { TreeNode } from 'src/stores/view/helpers/json-to-md/columns-to-json/columns-to-json-tree';

const nodeToMarkdown = (node: TreeNode): string => {
    let markdown = `${node.content}\n\n`;

    for (const child of node.children) {
        markdown += nodeToMarkdown(child);
    }

    return markdown;
};

export const treeToMarkdown = (nodes: TreeNode[]): string => {
    const mapped = nodes.map((node) => nodeToMarkdown(node));
    const last = mapped.pop() || '';
    mapped.push(last.replace(/\n\n$/, ''));
    return mapped.join('\n\n');
};
