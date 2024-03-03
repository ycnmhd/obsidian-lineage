import { traverseUp } from 'src/stores/document/helpers/search/traverse-up';
import { updateEditingNodeOnActiveNodeChange } from 'src/stores/document/reducers/editing/update-editing-node-on-active-node-change';
import { findGroupByNodeId } from 'src/stores/document/helpers/search/find-group-by-node-id';
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
        const childGroups: NodeId[] = [];
        traverseDown(childGroups, columns, node);
        const group = findGroupByNodeId(columns, node);
        if (!group) throw new Error('could not find group for node ' + node);
        state.activeBranch = {
            childGroups: new Set<string>(childGroups),
            sortedParentNodes: sortedParents.reverse(),
            node: node,
            group: group.parentId,
        };
    } else {
        state.activeBranch = {
            node: '',
            group: '',
            childGroups: new Set<string>(),
            sortedParentNodes: [],
        };
    }
};
