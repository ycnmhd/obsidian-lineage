import { findNode } from 'src/stores/document/helpers/find-node';
import {
    findSiblings,
    traverseDown,
    traverseUp,
} from 'src/stores/document/helpers/find-branch';
import {
    ColumnNode,
    DocumentState,
} from 'src/stores/document/document-reducer';
import { updateEditingNodeOnActiveNodeChange } from 'src/stores/document/reducers/editing/update-editing-node-on-active-node-change';

export const updateActiveNode = (
    state: DocumentState,
    nodeId: string | undefined,
    newNode = false,
) => {
    if (nodeId) updateEditingNodeOnActiveNodeChange(state, nodeId, newNode);

    const node = nodeId ? findNode(state.columns, nodeId) : null;
    if (node) {
        const sortedParents: ColumnNode[] = [];

        traverseUp(sortedParents, state.columns, node);
        const parentIDs = new Set<string>(sortedParents.map((n) => n.id));
        const childGroups = new Set<string>();
        const childNodes = new Set<string>();
        traverseDown(childGroups, childNodes, state.columns, node);
        const siblingNodes = new Set<string>();
        findSiblings(siblingNodes, state.columns, node);
        state.state.activeBranch.parentNodes = parentIDs;
        state.state.activeBranch.childGroups = childGroups;
        state.state.activeBranch.childNodes = childNodes;
        state.state.activeBranch.siblingNodes = siblingNodes;
        state.state.activeBranch.sortedParentNodes = sortedParents.reverse();
    } else {
        state.state.activeBranch = {
            node: '',
            childNodes: new Set<string>(),
            parentNodes: new Set<string>(),
            siblingNodes: new Set<string>(),
            childGroups: new Set<string>(),
            sortedParentNodes: [],
        };
    }
};
