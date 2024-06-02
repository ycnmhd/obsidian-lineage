import { parseDelimiter } from 'src/stores/view/helpers/json-to-md/markdown-to-json/helpers/delimiter';
import { TreeNode } from 'src/stores/view/helpers/json-to-md/columns-to-json/columns-to-json-tree';

export type State = {
    currentNodes: TreeNode[];
    currentNode: null | TreeNode;
    tree: TreeNode[];
};

export const addNewNode = (state: State, level: number, text: string) => {
    state.currentNode = {
        content: text,
        children: [],
    };
    if (level === 1) {
        state.tree.push(state.currentNode);
        state.currentNodes = [state.currentNode];
    } else {
        if (state.currentNodes[level - 2]) {
            state.currentNodes[level - 2].children.push(state.currentNode);
        }
        state.currentNodes[level - 1] = state.currentNode;
    }
};

export const updateCurrentNode = (state: State, text: string) => {
    if (state.currentNode) {
        if (state.currentNode.content) state.currentNode.content += '\n';
        state.currentNode.content += text;
    } else if (text.trim()) {
        state.currentNode = {
            content: text,
            children: [],
        };
        state.tree.push(state.currentNode);
    }
};

export const outlineToJson = (input: string): TreeNode[] => {
    const lines = input.split('\n');
    const state: State = {
        currentNodes: [],
        currentNode: null,
        tree: [],
    };

    for (const line of lines) {
        if (parseDelimiter(line)) throw new Error('input has a section');

        const outlineMatch = line.match(/^(\t*)- (.+)/);
        if (outlineMatch) {
            const level = outlineMatch[1].length + 1;
            addNewNode(state, level, outlineMatch[2]);
        } else {
            updateCurrentNode(state, line);
        }
    }

    return state.tree;
};
