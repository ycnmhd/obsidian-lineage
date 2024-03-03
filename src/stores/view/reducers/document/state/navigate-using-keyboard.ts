import { Column, DocumentInstanceState } from 'src/stores/view/view-state-type';
import { AllDirections } from 'src/stores/view/view-reducer';
import { updateActiveNode } from 'src/stores/view/reducers/document/state/helpers/update-active-node';
import { findNextActiveNode } from 'src/stores/view/reducers/document/state/helpers/find-next-node/find-next-active-node';

export type ChangeActiveNodeAction = {
    type: 'DOCUMENT/NAVIGATE_USING_KEYBOARD';
    payload: {
        direction: AllDirections;
    };
};

export const navigateUsingKeyboard = (
    columns: Column[],
    state: DocumentInstanceState,
    action: ChangeActiveNodeAction,
) => {
    const nextNode = findNextActiveNode(columns, state, action);
    if (nextNode) {
        updateActiveNode(columns, state, nextNode);
    }
};
