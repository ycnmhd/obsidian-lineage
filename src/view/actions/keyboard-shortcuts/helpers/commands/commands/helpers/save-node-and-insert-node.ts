import { Direction } from 'src/stores/document/document-store-actions';
import { saveNodeContent } from 'src/view/actions/keyboard-shortcuts/helpers/commands/commands/helpers/save-node-content';
import Lineage from 'src/main';
import { getActiveLineageView } from 'src/view/actions/keyboard-shortcuts/helpers/commands/commands/helpers/get-active-lineage-view';

import { isEditing } from 'src/view/actions/keyboard-shortcuts/helpers/commands/commands/helpers/is-editing';

export const saveNodeAndInsertNode = (
    plugin: Lineage,
    direction: Direction,
    content = '',
) => {
    const view = getActiveLineageView(plugin);
    if (isEditing(view)) {
        saveNodeContent(view);
    }
    view.documentStore.dispatch({
        type: 'DOCUMENT/INSERT_NODE',
        payload: {
            position: direction,
            content,
            activeNodeId: view.viewStore.getValue().document.activeNode,
        },
    });
};
