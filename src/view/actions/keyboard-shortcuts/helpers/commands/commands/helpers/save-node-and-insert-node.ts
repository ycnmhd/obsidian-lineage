import { Direction } from 'src/stores/document/document-store-actions';
import { saveNodeContent } from 'src/view/actions/keyboard-shortcuts/helpers/commands/commands/helpers/save-node-content';

import { isEditing } from 'src/view/actions/keyboard-shortcuts/helpers/commands/commands/helpers/is-editing';
import { LineageView } from 'src/view/view';

export const saveNodeAndInsertNode = (
    view: LineageView,
    direction: Direction,
    content = '',
) => {
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
