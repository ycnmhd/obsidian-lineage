import { parseDelimiter } from 'src/stores/view/helpers/json-to-md/markdown-to-json/helpers/delimiter';
import { TreeNode } from 'src/stores/view/helpers/json-to-md/columns-to-json/columns-to-json-tree';

type State = {
    currentNodes: TreeNode[];
    currentNode: null | TreeNode;
};

export const headingsToJson = (input: string): TreeNode[] => {
    const lines = input.split('\n');
    const state: State = {
        currentNodes: [],
        currentNode: null,
    };
    const tree: TreeNode[] = [];

    for (const line of lines) {
        if (parseDelimiter(line)) throw new Error('input has a section');

        const headingMatch = line.match(/^(#+) (.+)/);
        if (headingMatch) {
            const level = headingMatch[1].length;
            state.currentNode = {
                content: line,
                children: [],
            };
            if (level === 1) {
                tree.push(state.currentNode);
                state.currentNodes = [state.currentNode];
            } else {
                if (state.currentNodes[level - 2]) {
                    state.currentNodes[level - 2].children.push(
                        state.currentNode,
                    );
                }
                state.currentNodes[level - 1] = state.currentNode;
            }
        } else {
            if (state.currentNode) {
                if (state.currentNode.content)
                    state.currentNode.content += '\n';
                state.currentNode.content += line;
            } else if (line.trim()) {
                state.currentNode = {
                    content: line,
                    children: [],
                };
                tree.push(state.currentNode);
            }
        }
    }

    return tree;
};
