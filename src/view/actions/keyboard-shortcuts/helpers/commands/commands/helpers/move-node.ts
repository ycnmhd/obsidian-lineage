import { AllDirections } from 'src/stores/document/document-store-actions';
import { saveNodeContent } from 'src/view/actions/keyboard-shortcuts/helpers/commands/commands/helpers/save-node-content';
import { LineageView } from 'src/view/view';

export const moveNode = (view: LineageView, direction: AllDirections) => {
    saveNodeContent(view);
    view.documentStore.dispatch({
        type: 'DOCUMENT/MOVE_NODE',
        payload: {
            direction,
            activeNodeId: view.viewStore.getValue().document.activeNode,
        },
    });
};
