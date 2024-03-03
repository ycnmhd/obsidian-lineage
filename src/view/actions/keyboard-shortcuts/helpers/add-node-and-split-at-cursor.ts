import { LineageView, ViewStore } from 'src/view/view';
import Lineage from 'src/main';
import { Direction } from 'src/stores/view/view-reducer';

export const addNodeAndSplitAtCursor = (
    store: ViewStore,
    plugin: Lineage,
    position: Direction,
) => {
    let text: string = '';
    const view = plugin.app.workspace.getActiveViewOfType(LineageView);
    if (view) {
        const textArea = view.containerEl.querySelector('textarea');
        if (textArea) {
            const cursor = textArea.selectionEnd;
            const value = textArea.value;
            if (cursor < value.length) {
                textArea.value = value.substring(0, cursor);
                text = value.substring(cursor);
            }
            if (position === 'up') {
                const temp = text;
                text = textArea.value;
                textArea.value = temp;
            }
        }
    }
    store.dispatch({
        type: 'DOCUMENT/INSERT_NODE',
        payload: {
            position,
            content: text,
        },
    });
};
