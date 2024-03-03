import {
    Column,
    DocumentInstanceState,
} from 'src/stores/document/document-type';
import { AllDirections } from 'src/stores/document/document-reducer';
import { updateActiveNode } from 'src/stores/document/reducers/state/shared/update-active-node';
import { findNextActiveNode } from 'src/stores/document/reducers/state/shared/find-next-node/find-next-active-node';

export type ChangeActiveNodeAction = {
    type: 'CHANGE_ACTIVE_NODE_USING_KEYBOARD';
    payload: {
        direction: AllDirections;
    };
};

export const changeActiveNodeUsingKeyboard = (
    columns: Column[],
    state: DocumentInstanceState,
    action: ChangeActiveNodeAction,
) => {
    const nextNode = findNextActiveNode(columns, state, action);
    if (nextNode) {
        updateActiveNode(columns, state, nextNode);
    }
};
