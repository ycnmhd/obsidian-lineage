import Lineage from 'src/main';
import { Direction } from 'src/stores/view/view-store-actions';

import { saveNodeAndInsertNode } from 'src/view/actions/keyboard-shortcuts/helpers/commands/commands/helpers/save-node-and-insert-node';
import { getActiveLineageView } from 'src/view/actions/keyboard-shortcuts/helpers/commands/commands/helpers/get-active-lineage-view';
import { getTextAreaOfView } from 'src/view/actions/keyboard-shortcuts/helpers/commands/commands/helpers/get-text-area-of-view';

export const addNodeAndSplitAtCursor = (
    plugin: Lineage,
    direction: Direction,
) => {
    let text: string = '';
    const view = getActiveLineageView(plugin);
    const textArea = getTextAreaOfView(view);
    const cursor = textArea.selectionEnd;
    const value = textArea.value;
    if (cursor < value.length) {
        textArea.value = value.substring(0, cursor);
        text = value.substring(cursor);
    }
    if (direction === 'up') {
        const temp = text;
        text = textArea.value;
        textArea.value = temp;
    }

    saveNodeAndInsertNode(plugin, direction, text);
};
