import { Columns, Content } from 'src/stores/document/document-state-type';

const createTreeNode = (content = ''): TreeNode => {
    return {
        content: content.trim(),
        children: [],
    };
};

export type TreeNode = {
    content: string;
    children: TreeNode[];
};

export const columnsToJsonTree = (columns: Columns, content: Content) => {
    const nodeMap: { [id: string]: TreeNode } = {};
    for (const column of columns) {
        for (const group of column.groups) {
            for (const node of group.nodes) {
                const treeNode = createTreeNode(content[node]?.content);
                let parentNode: TreeNode = nodeMap[group.parentId];
                if (!parentNode) {
                    parentNode = createTreeNode();
                    nodeMap[group.parentId] = parentNode;
                }
                parentNode.children.push(treeNode);
                nodeMap[node] = treeNode;
            }
        }
    }

    const roots: TreeNode[] = [];
    if (columns[0])
        for (const group of columns[0].groups) {
            for (const node of group.nodes) {
                const treeNode = nodeMap[node];
                if (treeNode) {
                    roots.push(treeNode);
                } else {
                    throw new Error(`could not find node ${node}`);
                }
            }
        }

    return roots;
};
