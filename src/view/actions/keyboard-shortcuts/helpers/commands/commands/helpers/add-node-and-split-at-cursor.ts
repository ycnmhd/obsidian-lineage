import Lineage from 'src/main';
import { Direction } from 'src/stores/document/document-store-actions';

import { saveNodeAndInsertNode } from 'src/view/actions/keyboard-shortcuts/helpers/commands/commands/helpers/save-node-and-insert-node';
import { getActiveLineageView } from 'src/view/actions/keyboard-shortcuts/helpers/commands/commands/helpers/get-active-lineage-view';
import { getTextAreaOfView } from 'src/view/actions/keyboard-shortcuts/helpers/commands/commands/helpers/get-text-area-of-view';
import invariant from 'tiny-invariant';

export const addNodeAndSplitAtCursor = (
    plugin: Lineage,
    direction: Direction,
) => {
    let text: string = '';
    const view = getActiveLineageView(plugin);
    const textArea = getTextAreaOfView(view);
    invariant(textArea, 'could not find textarea element');
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
