import { Direction } from 'src/stores/document/document-store-actions';

import { saveNodeAndInsertNode } from 'src/view/actions/keyboard-shortcuts/helpers/commands/commands/helpers/save-node-and-insert-node';
import { LineageView } from 'src/view/view';
import { EditorPosition } from 'obsidian';

const flattenEditorPosition = (value: string, cursor: EditorPosition) => {
    const lines = value.split('\n');
    let total = 0;
    for (let i = 0; i < lines.length; i++) {
        if (cursor.line === i) {
            return total + cursor.ch;
        } else {
            total += lines[i].length;
        }
    }
    throw new Error(`invalid cursor line: ${cursor.line} ch: ${cursor.ch}`);
};

export const addNodeAndSplitAtCursor = (
    view: LineageView,
    direction: Direction,
) => {
    let text: string = '';
    let firstHalf = '',
        secondHalf = '';

    const value = view.inlineEditor.getContent();
    const cursor = flattenEditorPosition(value, view.inlineEditor.getCursor());

    if (cursor < value.length) {
        firstHalf = value.substring(0, cursor);
        secondHalf = value.substring(cursor);
        if (direction === 'up') {
            view.inlineEditor.setContent(secondHalf);
            text = firstHalf;
        } else {
            view.inlineEditor.setContent(firstHalf);
            text = secondHalf;
        }
    }

    saveNodeAndInsertNode(view, direction, text);
};
