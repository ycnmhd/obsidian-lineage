import {
    Column,
    NavigationHistory,
} from 'src/stores/document/document-state-type';
import { updateActiveNode } from 'src/stores/view/reducers/document/helpers/update-active-node';
import { findNextActiveNode } from 'src/stores/view/reducers/document/helpers/find-next-node/find-next-active-node';
import { DocumentViewState } from 'src/stores/view/view-state-type';

export type JumpTarget =
    | 'start-of-group'
    | 'end-of-group'
    | 'start-of-column'
    | 'end-of-column';
export type JumpToNodeAction = {
    type: 'DOCUMENT/JUMP_TO_NODE';
    payload: {
        target: JumpTarget;
        columns: Column[];
    };
};

export const jumpToNode = (
    state: DocumentViewState,
    navigationHistory: NavigationHistory,
    action: JumpToNodeAction,
) => {
    const nextNode = findNextActiveNode(
        action.payload.columns,
        state.activeNode,
        action,
    );
    if (nextNode) {
        updateActiveNode(state, nextNode, navigationHistory);
    }
};
