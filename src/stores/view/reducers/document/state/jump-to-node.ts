import { Column, DocumentInstanceState } from 'src/stores/view/view-state-type';
import { updateActiveNode } from 'src/stores/view/reducers/document/state/helpers/update-active-node';
import { findNextActiveNode } from 'src/stores/view/reducers/document/state/helpers/find-next-node/find-next-active-node';

export type JumpTarget =
    | 'start-of-group'
    | 'end-of-group'
    | 'start-of-column'
    | 'end-of-column';
export type JumpToNodeAction = {
    type: 'DOCUMENT/JUMP_TO_NODE';
    payload: {
        target: JumpTarget;
    };
};

export const jumpToNode = (
    columns: Column[],
    state: DocumentInstanceState,
    action: JumpToNodeAction,
) => {
    const nextNode = findNextActiveNode(columns, state.activeNode, action);
    if (nextNode) {
        updateActiveNode(state, nextNode);
    }
};
