import { Column } from 'src/stores/document/document-state-type';
import { updateActiveNode } from 'src/stores/view/reducers/document/helpers/update-active-node';
import { findNextActiveNode } from 'src/lib/tree-utils/find/find-next-active-node';
import { DocumentViewState, ViewState } from 'src/stores/view/view-state-type';

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
    documentViewState: DocumentViewState,
    state: Pick<ViewState, 'navigationHistory'>,
    action: JumpToNodeAction,
) => {
    const nextNode = findNextActiveNode(
        action.payload.columns,
        documentViewState.activeNode,
        action,
    );
    if (nextNode) {
        updateActiveNode(documentViewState, nextNode, state);
    }
};
