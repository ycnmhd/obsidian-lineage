import {
    ColumnNode,
    Columns,
    DropAction,
} from 'src/view/store/document-reducer';
import { findGroup } from 'src/view/store/helpers/find-branch';

export const moveNodeAsSibling = (
    columns: Columns,
    action: DropAction,
    droppedNode: ColumnNode,
    targetNode: ColumnNode,
) => {
    const targetGroup = findGroup(columns, targetNode);
    if (targetGroup) {
        const index = targetGroup.nodes.findIndex(
            (n) => n.id === targetNode.id,
        );
        const insertionIndex =
            action.payload.position === 'top' ? index : index + 1;

        droppedNode.parentId = targetNode.parentId;
        targetGroup.nodes.splice(insertionIndex, 0, droppedNode);
    }
};
