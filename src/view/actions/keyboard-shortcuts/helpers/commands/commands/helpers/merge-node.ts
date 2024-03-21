import { VerticalDirection } from 'src/stores/document/document-store-actions';
import { saveNodeContent } from 'src/view/actions/keyboard-shortcuts/helpers/commands/commands/helpers/save-node-content';
import { getActiveLineageView } from 'src/view/actions/keyboard-shortcuts/helpers/commands/commands/helpers/get-active-lineage-view';
import Lineage from 'src/main';

export const mergeNode = (plugin: Lineage, direction: VerticalDirection) => {
    const view = getActiveLineageView(plugin);
    saveNodeContent(view);
    view.documentStore.dispatch({
        type: 'DOCUMENT/MERGE_NODE',
        payload: {
            direction,
            activeNodeId: view.viewStore.getValue().document.activeNode,
        },
    });
};
