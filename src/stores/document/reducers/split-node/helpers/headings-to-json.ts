import { parseDelimiter } from 'src/stores/view/helpers/json-to-md/markdown-to-json/helpers/delimiter';
import { TreeNode } from 'src/stores/view/helpers/json-to-md/columns-to-json/columns-to-json-tree';
import {
    addNewNode,
    State,
    updateCurrentNode,
} from 'src/lib/data-conversion/outline-to-json/outilne-to-json';

export const headingsToJson = (input: string): TreeNode[] => {
    const lines = input.split('\n');
    const state: State = {
        currentNodes: [],
        currentNode: null,
        tree: [],
    };

    for (const line of lines) {
        if (parseDelimiter(line)) throw new Error('input has a section');

        const match = line.match(/^(#+) (.+)/);
        if (match) {
            const level = match[1].length;

            addNewNode(state, level, line);
        } else {
            updateCurrentNode(state, line);
        }
    }

    return state.tree;
};
