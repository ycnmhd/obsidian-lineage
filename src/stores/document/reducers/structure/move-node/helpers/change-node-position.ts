import { AllDirections } from 'src/stores/document/document-reducer';
import { moveNodeAsChild } from 'src/stores/document/reducers/structure/move-node/helpers/move-node-as-child';
import { moveNodeAsSibling } from 'src/stores/document/reducers/structure/move-node/helpers/move-node-as-sibling';
import { cleanAndSortColumns } from 'src/stores/document/reducers/state/helpers/clean-and-sort-columns';
import { moveChildGroups } from 'src/stores/document/reducers/structure/move-node/helpers/move-child-groups';
import { ColumnNode, LineageDocument } from 'src/stores/document/document-type';
import { removeNodeFromGroup } from 'src/stores/document/reducers/structure/move-node/helpers/remove-node-from-group';

export const changeNodePosition = (
    document: Pick<LineageDocument, 'columns'>,
    node: ColumnNode,
    targetNode: ColumnNode,
    direction: AllDirections,
) => {
    removeNodeFromGroup(document.columns, node);
    if (direction === 'right') {
        moveNodeAsChild(document.columns, node, targetNode);
    } else {
        moveNodeAsSibling(
            document.columns,
            direction === 'left' ? 'down' : direction,
            node,
            targetNode,
        );
    }
    moveChildGroups(document.columns, node);
    cleanAndSortColumns(document);
};
