import { DocumentStore, LineageView } from 'src/view/view';
import Lineage from 'src/main';
import { NodeDirection } from 'src/stores/document/document-reducer';

export const addNodeAndSplitAtCursor = (
    store: DocumentStore,
    plugin: Lineage,
    position: NodeDirection,
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
            if (position === 'top') {
                const temp = text;
                text = textArea.value;
                textArea.value = temp;
            }
        }
    }
    store.dispatch({
        type: 'CREATE_NODE',
        payload: {
            position,
            content: text,
        },
    });
};
