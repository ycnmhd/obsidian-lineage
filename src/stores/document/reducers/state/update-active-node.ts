import { traverseUp } from 'src/stores/document/helpers/search/traverse-up';
import { updateEditingNodeOnActiveNodeChange } from 'src/stores/document/reducers/editing/update-editing-node-on-active-node-change';
import { findGroupByNodeId } from 'src/stores/document/helpers/search/find-group-by-node-id';
import { findSiblings } from 'src/stores/document/helpers/search/find-siblings';
import { traverseDown } from 'src/stores/document/helpers/search/traverse-down';
import { DocumentInstance } from 'src/stores/document/document-type';

export const updateActiveNode = (
    state: DocumentInstance,
    nodeId: string | undefined,
    newNode = false,
) => {
    if (nodeId) updateEditingNodeOnActiveNodeChange(state, nodeId, newNode);

    const node = nodeId;
    if (node) {
        const sortedParents = traverseUp(state.document.columns, node);
        const parentIDs = new Set<string>(sortedParents);
        const childGroups = new Set<string>();
        const childNodes = new Set<string>();
        traverseDown(childGroups, childNodes, state.document.columns, node);
        const siblingNodes = new Set<string>();
        findSiblings(siblingNodes, state.document.columns, node);
        const group = findGroupByNodeId(state.document.columns, node);
        if (!group) throw new Error('could not find group for node ' + node);
        state.state.activeBranch = {
            parentNodes: parentIDs,
            childGroups: childGroups,
            childNodes: childNodes,
            siblingNodes: siblingNodes,
            sortedParentNodes: sortedParents.reverse(),
            node: node,
            group: group.parentId,
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
