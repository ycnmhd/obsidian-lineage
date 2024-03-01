import { cachedFindNode } from 'src/stores/document/helpers/search/cached-find-node';
import { traverseUp } from 'src/stores/document/helpers/search/traverse-up';
import { DocumentState } from 'src/stores/document/document-reducer';
import { updateEditingNodeOnActiveNodeChange } from 'src/stores/document/reducers/editing/update-editing-node-on-active-node-change';
import { findGroup } from 'src/stores/document/helpers/search/find-group';
import { findSiblings } from 'src/stores/document/helpers/search/find-siblings';
import { traverseDown } from 'src/stores/document/helpers/search/traverse-down';

export const updateActiveNode = (
    state: DocumentState,
    nodeId: string | undefined,
    newNode = false,
) => {
    if (nodeId) updateEditingNodeOnActiveNodeChange(state, nodeId, newNode);

    const node = nodeId ? cachedFindNode(state.columns, nodeId) : null;
    if (node) {
        const sortedParents = traverseUp(state.columns, node);
        const parentIDs = new Set<string>(sortedParents.map((n) => n.id));
        const childGroups = new Set<string>();
        const childNodes = new Set<string>();
        traverseDown(childGroups, childNodes, state.columns, node);
        const siblingNodes = new Set<string>();
        findSiblings(siblingNodes, state.columns, node);
        const group = findGroup(state.columns, node);
        if (!group) throw new Error('could not find group for node ' + node.id);
        state.state.activeBranch = {
            parentNodes: parentIDs,
            childGroups: childGroups,
            childNodes: childNodes,
            siblingNodes: siblingNodes,
            sortedParentNodes: sortedParents.reverse(),
            node: node.id,
            group: group.id,
        };
    } else {
        state.state.activeBranch = {
            node: '',
            group: '',
            childNodes: new Set<string>(),
            parentNodes: new Set<string>(),
            siblingNodes: new Set<string>(),
            childGroups: new Set<string>(),
            sortedParentNodes: [],
        };
    }
};
