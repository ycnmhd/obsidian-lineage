import { ColumnNode, Columns } from 'src/view/store/document-reducer';

const createTreeNode = (node: ColumnNode): TreeNode => {
    return {
        // id: node.id,
        content: node.content,
        children: [],
    };
};

export type TreeNode = {
    // id: string;
    content: string;
    children: TreeNode[];
};

export const columnsToJsonTree = (columns: Columns) => {
    const nodeMap: { [id: string]: TreeNode } = {};
    for (const column of columns) {
        for (const group of column.groups) {
            for (const node of group.nodes) {
                const treeNode = createTreeNode(node);
                let parentNode: TreeNode = nodeMap[node.parentId];
                if (!parentNode) {
                    parentNode = createTreeNode({
                        id: node.parentId,
                        parentId: '',
                        content: '',
                    });
                    nodeMap[node.parentId] = parentNode;
                }
                parentNode.children.push(treeNode);
                nodeMap[node.id] = treeNode;
            }
        }
    }

    const roots: TreeNode[] = [];
    for (const group of columns[0].groups) {
        for (const node of group.nodes) {
            const treeNode = nodeMap[node.id];
            if (treeNode) {
                roots.push(treeNode);
            } else {
                throw new Error(`could not find node ${node.id}`);
            }
        }
    }

    return roots;
};
