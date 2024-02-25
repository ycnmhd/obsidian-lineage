import { findNode } from 'src/view/store/helpers/find-node';
import {
    findSiblings,
    traverseDown,
    traverseUp,
} from 'src/view/store/helpers/find-branch';
import { DocumentState } from 'src/view/store/document-reducer';
import { updateEditingNodeOnActiveNodeChange } from 'src/view/store/reducers/editing/update-editing-node-on-active-node-change';

export const updateActiveNode = (
    state: DocumentState,
    nodeId: string | undefined,
    newNode = false,
) => {
    if (nodeId) updateEditingNodeOnActiveNodeChange(state, nodeId, newNode);

    const node = nodeId ? findNode(state.columns, nodeId) : null;
    if (node) {
        const parentIDs = new Set<string>();
        traverseUp(parentIDs, state.columns, node);
        const childGroups = new Set<string>();
        const childNodes = new Set<string>();
        traverseDown(childGroups, childNodes, state.columns, node);
        const siblingNodes = new Set<string>();
        findSiblings(siblingNodes, state.columns, node);
        state.state.activeBranch.parentNodes = parentIDs;
        state.state.activeBranch.childGroups = childGroups;
        state.state.activeBranch.childNodes = childNodes;
        state.state.activeBranch.siblingNodes = siblingNodes;
    } else {
        state.state.activeBranch = {
            node: '',
            childNodes: new Set<string>(),
            parentNodes: new Set<string>(),
            siblingNodes: new Set<string>(),
            childGroups: new Set<string>(),
        };
    }
};
