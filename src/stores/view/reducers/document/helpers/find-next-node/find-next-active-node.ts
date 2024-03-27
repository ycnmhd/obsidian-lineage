import { Column } from 'src/stores/document/document-state-type';
import { DeleteNodeAction } from 'src/stores/document/reducers/delete-node/delete-node';
import { ChangeActiveNodeAction } from 'src/stores/view/reducers/document/navigate-using-keyboard';
import { findNextNodeAfterDeletion } from 'src/stores/view/reducers/document/helpers/find-next-node/find-next-node-after-deletion';
import { findNextActiveNodeOnKeyboardNavigation } from 'src/stores/view/reducers/document/helpers/find-next-node/find-next-active-node-on-keyboard-navigation';
import { JumpToNodeAction } from 'src/stores/view/reducers/document/jump-to-node';
import { findNodeToJumpTo } from 'src/stores/view/reducers/document/helpers/find-next-node/find-node-to-jump-to';

export const findNextActiveNode = (
    columns: Column[],
    node: string,
    action: DeleteNodeAction | ChangeActiveNodeAction | JumpToNodeAction,
) => {
    if (action.type === 'DOCUMENT/DELETE_NODE') {
        return findNextNodeAfterDeletion(columns, node);
    } else if (action.type === 'DOCUMENT/NAVIGATE_USING_KEYBOARD') {
        return findNextActiveNodeOnKeyboardNavigation(
            columns,
            node,
            action.payload.direction,
        );
    } else if (action.type === 'DOCUMENT/JUMP_TO_NODE') {
        return findNodeToJumpTo(columns, node, action.payload.target);
    }
};
