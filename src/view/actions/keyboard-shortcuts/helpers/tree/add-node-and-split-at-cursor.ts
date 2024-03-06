import { ViewStore } from 'src/view/view';
import Lineage from 'src/main';
import { Direction } from 'src/stores/view/view-reducer';

import { saveNodeAndInsertNode } from 'src/view/actions/keyboard-shortcuts/helpers/tree/save-node-and-insert-node';
import { activeTextArea } from 'src/view/components/container/column/components/group/components/card/actions/save-node-content-action';

export const addNodeAndSplitAtCursor = (
    store: ViewStore,
    plugin: Lineage,
    direction: Direction,
) => {
    let text: string = '';
    const textArea = activeTextArea.element;
    if (textArea) {
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
    }

    saveNodeAndInsertNode(store, direction, text);
};
