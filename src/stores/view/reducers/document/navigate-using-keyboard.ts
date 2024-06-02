import { Column } from 'src/stores/document/document-state-type';
import { AllDirections } from 'src/stores/document/document-store-actions';
import { updateActiveNode } from 'src/stores/view/reducers/document/helpers/update-active-node';
import { findNextActiveNodeOnKeyboardNavigation } from 'src/lib/tree-utils/find/find-next-active-node-on-keyboard-navigation';
import { DocumentViewState, ViewState } from 'src/stores/view/view-state-type';

export type ChangeActiveNodeAction = {
    type: 'DOCUMENT/NAVIGATE_USING_KEYBOARD';
    payload: {
        direction: AllDirections;
        columns: Column[];
    };
};

export const navigateUsingKeyboard = (
    documentState: DocumentViewState,
    state: Pick<ViewState, 'navigationHistory'>,
    action: ChangeActiveNodeAction,
) => {
    const nextNode = findNextActiveNodeOnKeyboardNavigation(
        action.payload.columns,
        documentState.activeNode,
        action.payload.direction,
        documentState.activeNodesOfColumn,
    );
    if (nextNode) {
        updateActiveNode(documentState, nextNode, state);
    }
};
