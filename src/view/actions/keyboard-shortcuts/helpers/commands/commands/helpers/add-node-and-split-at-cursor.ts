import { Direction } from 'src/stores/document/document-store-actions';

import { saveNodeAndInsertNode } from 'src/view/actions/keyboard-shortcuts/helpers/commands/commands/helpers/save-node-and-insert-node';
import invariant from 'tiny-invariant';
import { inlineEditorViews } from 'src/view/actions/inline-editor/load-inline-editor';
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
    const inlineEditor = inlineEditorViews.get(view);

    invariant(inlineEditor, 'could not find textarea element');
    const value = inlineEditor.view.editor.getValue();
    const cursor = flattenEditorPosition(
        value,
        inlineEditor.view.editor.getCursor(),
    );

    if (cursor < value.length) {
        firstHalf = value.substring(0, cursor);
        secondHalf = value.substring(cursor);
        if (direction === 'up') {
            inlineEditor.view.__setViewData__(secondHalf, true);
            text = firstHalf;
        } else {
            inlineEditor.view.__setViewData__(firstHalf, true);
            text = secondHalf;
        }
    }

    saveNodeAndInsertNode(view, direction, text);
};
