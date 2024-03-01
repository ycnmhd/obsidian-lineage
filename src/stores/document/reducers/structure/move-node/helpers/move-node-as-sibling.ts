import {
    Column,
    ColumnNode,
    Columns,
    VerticalDirection,
} from 'src/stores/document/document-reducer';

import { findGroup } from 'src/stores/document/helpers/search/find-group';

export const removeNodeFromGroup = (columns: Column[], node: ColumnNode) => {
    const currentGroup = findGroup(columns, node);
    if (currentGroup) {
        currentGroup.nodes = currentGroup.nodes.filter((n) => n.id !== node.id);
    }
};

export const moveNodeAsSibling = (
    columns: Columns,
    direction: VerticalDirection,
    node: ColumnNode,
    targetNode: ColumnNode,
) => {
    const targetGroup = findGroup(columns, targetNode);
    if (targetGroup) {
        const index = targetGroup.nodes.findIndex(
            (n) => n.id === targetNode.id,
        );
        const insertionIndex = direction === 'up' ? index : index + 1;

        node.parentId = targetNode.parentId;
        targetGroup.nodes.splice(insertionIndex, 0, node);
    }
};
