import { ColumnNode } from 'src/view/store/document-reducer';
import { DocumentStore } from 'src/view/view';

type Props = { editing: boolean; node: ColumnNode; store: DocumentStore };
export const saveNodeContent = (
    element: HTMLTextAreaElement,
    { store, editing, node }: Props,
) => {
    const state = {
        wasEditing: editing,
    };
    if (editing) {
        element.value = node.content;
        element.focus({ preventScroll: false });
    }
    return {
        update: ({ node, editing, store }: Props) => {
            if (editing && !state.wasEditing) {
                element.value = node.content;
                state.wasEditing = true;
            } else if (!editing && state.wasEditing) {
                if (store.getValue().state.editing.savePreviousNode)
                    store.dispatch({
                        type: 'SET_NODE_CONTENT',
                        payload: {
                            nodeId: node.id,
                            content: element.value,
                        },
                    });
                state.wasEditing = false;
            }
        },
        destroy: () => {
            if (store.getValue().state.editing.savePreviousNode)
                store.dispatch({
                    type: 'SET_NODE_CONTENT',
                    payload: {
                        nodeId: node.id,
                        content: element.value,
                    },
                });
        },
    };
};
