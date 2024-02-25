import { parseDelimiter } from 'src/stores/document/helpers/json-to-md/markdown-to-json/helpers/delimiter';
import { TreeNode } from 'src/stores/document/helpers/json-to-md/columns-to-json/columns-to-json-tree';

const depthLevel = (number: string) => {
    if (number.includes('.')) {
        return number.split('.').length;
    } else return /\d+/.test(number) ? 1 : 0;
};

const trimCurrentNode = (node: TreeNode | undefined) => {
    if (node) {
        node.content = node.content.trim();
    }
};

export const markdownToJson = (text: string) => {
    const lines = text.split('\n');

    const map: Record<string, TreeNode> = {};
    const tree: TreeNode[] = [];
    let currentNode: TreeNode | null = null;

    let currentParentNumber = '';
    for (const line of lines) {
        const sectionNumber = parseDelimiter(line);
        if (sectionNumber) {
            const [parent, , full] = sectionNumber;
            const isASibling = parent === currentParentNumber;

            const newNode = {
                content: '',
                children: [],
            };
            map[full] = newNode;
            if (isASibling) {
                if (currentNode) trimCurrentNode(currentNode);
                const parentNode = map[parent];
                if (parentNode) {
                    parentNode.children.push(newNode);
                } else {
                    tree.push(newNode);
                }
                currentNode = newNode;
            } else {
                const isChild =
                    depthLevel(parent) > depthLevel(currentParentNumber);
                if (isChild) {
                    if (!currentNode) {
                        throw new Error(`could not find parent of ${full}`);
                    }
                    trimCurrentNode(currentNode);
                    currentNode.children.push(newNode);
                    currentNode = newNode;
                } else {
                    if (parent.split('.').length === 1) {
                        if (currentNode) trimCurrentNode(currentNode);
                        tree.push(newNode);
                        currentNode = newNode;
                    } else {
                        const parentNode = map[parent];
                        if (!parentNode) {
                            throw new Error(`could not find parent of ${full}`);
                        }
                        if (currentNode) trimCurrentNode(currentNode);
                        parentNode.children.push(newNode);
                        currentNode = newNode;
                    }
                }
            }
            currentParentNumber = parent;
        } else {
            if (currentNode) {
                if (currentNode.content) currentNode.content += '\n';
                currentNode.content += line;
            }
        }
    }
    return tree;
};
