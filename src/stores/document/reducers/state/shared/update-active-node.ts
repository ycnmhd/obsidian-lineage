import { traverseUp } from 'src/stores/document/helpers/search/traverse-up';
import { updateEditingNodeOnActiveNodeChange } from 'src/stores/document/reducers/editing/update-editing-node-on-active-node-change';
import { findGroupByNodeId } from 'src/stores/document/helpers/search/find-group-by-node-id';
import { findSiblings } from 'src/stores/document/helpers/search/find-siblings';
import { traverseDown } from 'src/stores/document/helpers/search/traverse-down';
import {
    Column,
    DocumentInstanceState,
    NodeId,
} from 'src/stores/document/document-type';

export const updateActiveNode = (
    columns: Column[],
    state: DocumentInstanceState,
    nodeId: string | undefined,
    newNode = false,
) => {
    if (nodeId) updateEditingNodeOnActiveNodeChange(state, nodeId, newNode);

    const node = nodeId;
    if (node) {
        const sortedParents = traverseUp(columns, node);
        const parentIDs = new Set<string>(sortedParents);
        const childGroups: NodeId[] = [];
        const childNodes = new Set<string>();
        traverseDown(childGroups, childNodes, columns, node);
        const siblingNodes = new Set<string>();
        findSiblings(siblingNodes, columns, node);
        const group = findGroupByNodeId(columns, node);
        if (!group) throw new Error('could not find group for node ' + node);
        state.activeBranch = {
            parentNodes: parentIDs,
            childGroups: new Set<string>(childGroups),
            childNodes: childNodes,
            siblingNodes: siblingNodes,
            sortedParentNodes: sortedParents.reverse(),
            node: node,
            group: group.parentId,
        };
    } else {
        state.activeBranch = {
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
