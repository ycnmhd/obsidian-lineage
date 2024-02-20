import { findNode } from 'src/view/store/helpers/find-node';
import {
    findSiblings,
    traverseDown,
    traverseUp,
} from 'src/view/store/helpers/find-branch';
import { State } from 'src/view/store/document.store';

export const updateActiveNode = (
    store: State,
    nodeId: string,
    newNode = false,
) => {
    store.state.activeBranch.node = nodeId;
    if (newNode) store.state.editing.node = nodeId;
    else if (store.state.editing.node !== nodeId) store.state.editing.node = '';
    const node = findNode(store.matrix, nodeId);
    if (node) {
        const parentIDs = new Set<string>();
        traverseUp(parentIDs, store.matrix, node);
        const childGroups = new Set<string>();
        const childNodes = new Set<string>();
        traverseDown(childGroups, childNodes, store.matrix, node);
        const siblingNodes = new Set<string>();
        findSiblings(siblingNodes, store.matrix, node);
        store.state.activeBranch.parentNodes = parentIDs;
        store.state.activeBranch.childGroups = childGroups;
        store.state.activeBranch.childNodes = childNodes;
        store.state.activeBranch.siblingNodes = siblingNodes;
    }
};
