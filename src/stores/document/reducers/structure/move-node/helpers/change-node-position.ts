import {
    AllDirections,
    ColumnNode,
    DocumentState,
} from 'src/stores/document/document-reducer';
import { moveNodeAsChild } from 'src/stores/document/reducers/structure/move-node/helpers/move-node-as-child';
import {
    moveNodeAsSibling,
    removeNodeFromGroup,
} from 'src/stores/document/reducers/structure/move-node/helpers/move-node-as-sibling';
import { cleanAndSortColumns } from 'src/stores/document/reducers/state/helpers/clean-and-sort-columns';
import { moveChildGroups } from 'src/stores/document/reducers/structure/move-node/helpers/move-child-groups';

export const changeNodePosition = (
    state: Pick<DocumentState, 'columns'>,
    node: ColumnNode,
    targetNode: ColumnNode,
    direction: AllDirections,
) => {
    removeNodeFromGroup(state.columns, node);
    if (direction === 'right') {
        moveNodeAsChild(state.columns, node, targetNode);
    } else {
        moveNodeAsSibling(
            state.columns,
            direction === 'left' ? 'down' : direction,
            node,
            targetNode,
        );
    }
    moveChildGroups(state.columns, node);
    cleanAndSortColumns(state);
};
