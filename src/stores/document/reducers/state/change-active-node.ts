import { DocumentState } from 'src/stores/document/document-type';
import { AllDirections } from 'src/stores/document/document-reducer';
import { updateActiveNode } from 'src/stores/document/reducers/state/update-active-node';
import { findNextActiveNode } from 'src/stores/document/reducers/state/helpers/find-next-active-node';

export type ChangeActiveNodeAction = {
    type: 'CHANGE_ACTIVE_NODE';
    payload: {
        direction: AllDirections;
    };
};

export const changeActiveNode = (
    state: DocumentState,
    action: ChangeActiveNodeAction,
) => {
    const nextNode = findNextActiveNode(state, action);
    if (nextNode) {
        updateActiveNode(state, nextNode);
    }
};
