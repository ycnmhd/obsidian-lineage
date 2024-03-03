import {
    Column,
    DocumentInstanceState,
} from 'src/stores/document/document-type';
import { DeleteNodeAction } from 'src/stores/document/reducers/structure/delete-node/delete-node';
import { ChangeActiveNodeAction } from 'src/stores/document/reducers/state/change-active-node-using-keyboard';
import { LoadDocumentAction } from 'src/stores/document/reducers/file/load-document/load-document';
import { findNextNodeAfterDeletion } from 'src/stores/document/reducers/state/shared/find-next-node/find-next-node-after-deletion';
import { findNextActiveNodeOnKeyboardNavigation } from 'src/stores/document/reducers/state/shared/find-next-node/find-next-active-node-on-keyboard-navigation';
import { findInitialActiveNode } from 'src/stores/document/reducers/state/shared/find-next-node/find-initial-active-node';

export const findNextActiveNode = (
    columns: Column[],
    state: DocumentInstanceState,
    action: DeleteNodeAction | ChangeActiveNodeAction | LoadDocumentAction,
) => {
    const node = state.activeBranch.node;
    if (action.type === 'TREE/DELETE_NODE') {
        return findNextNodeAfterDeletion(columns, node);
    } else if (action.type === 'CHANGE_ACTIVE_NODE_USING_KEYBOARD') {
        return findNextActiveNodeOnKeyboardNavigation(
            columns,
            node,
            action.payload.direction,
        );
    } else if (action.type === 'APPLY_SNAPSHOT') {
        return findInitialActiveNode(columns, action.payload.document.position);
    } else if (action.type === 'FILE/LOAD_DOCUMENT') {
        return findInitialActiveNode(columns, action.payload.document.position);
    }
};
