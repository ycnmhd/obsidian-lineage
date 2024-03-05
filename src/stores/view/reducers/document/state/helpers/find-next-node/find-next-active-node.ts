import { Column } from 'src/stores/view/view-state-type';
import { DeleteNodeAction } from 'src/stores/view/reducers/document/structure/delete-node/delete-node';
import { ChangeActiveNodeAction } from 'src/stores/view/reducers/document/state/navigate-using-keyboard';
import { LoadDocumentAction } from 'src/stores/view/reducers/document/io/load-document-from-file/load-document-from-file';
import { findNextNodeAfterDeletion } from 'src/stores/view/reducers/document/state/helpers/find-next-node/find-next-node-after-deletion';
import { findNextActiveNodeOnKeyboardNavigation } from 'src/stores/view/reducers/document/state/helpers/find-next-node/find-next-active-node-on-keyboard-navigation';
import { findInitialActiveNode } from 'src/stores/view/reducers/document/state/helpers/find-next-node/find-initial-active-node';

export const findNextActiveNode = (
    columns: Column[],
    node: string,
    action: DeleteNodeAction | ChangeActiveNodeAction | LoadDocumentAction,
) => {
    if (action.type === 'DOCUMENT/DELETE_NODE') {
        return findNextNodeAfterDeletion(columns, node);
    } else if (action.type === 'DOCUMENT/NAVIGATE_USING_KEYBOARD') {
        return findNextActiveNodeOnKeyboardNavigation(
            columns,
            node,
            action.payload.direction,
        );
    } else if (action.type === 'DOCUMENT/LOAD_FILE') {
        return findInitialActiveNode(columns, action.payload.document.position);
    }
};
