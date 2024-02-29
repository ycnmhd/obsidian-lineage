import { findNode } from 'src/stores/document/helpers/find-node';
import {
    findGroup,
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
