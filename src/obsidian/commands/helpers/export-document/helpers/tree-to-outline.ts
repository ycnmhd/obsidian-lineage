import { TreeNode } from 'src/stores/view/helpers/json-to-md/columns-to-json/columns-to-json-tree';

const formatContent = (content: string, indent: string): string => {
    const lines = content.split('\n');
    return lines.length === 1
        ? lines[0]
        : lines
              .map((line, i) => (i === 0 ? line : `${indent}  ${line}`))
              .join('\n');
};

const nodeToOutline = (node: TreeNode, depth: number = 0): string => {
    const indent = '\t'.repeat(depth);
    let outline = `${indent}- ${formatContent(node.content, indent)}\n`;

    for (const child of node.children) {
        outline += nodeToOutline(child, depth + 1);
    }

    return outline;
};

export const treeToOutline = (nodes: TreeNode[], depth: number = 0): string => {
    const mapped = nodes.map((node) => nodeToOutline(node, depth));
    const last = mapped.pop() || '';
    mapped.push(last.replace(/\n$/, ''));
    return mapped.join('');
};
