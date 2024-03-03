import { NodeId } from 'src/stores/document/document-type';
import { DocumentStore } from 'src/view/view';

type Props = { editing: boolean; node: NodeId; store: DocumentStore };
export const saveNodeContent = (
    element: HTMLTextAreaElement,
    { store, editing, node }: Props,
) => {
    const state = {
        wasEditing: editing,
    };
    const documentState = store.getValue();
    if (editing) {
        element.value = documentState.document.content[node]?.content || '';
        element.focus({ preventScroll: false });
    }
    return {
        update: ({ node, editing, store }: Props) => {
            if (editing && !state.wasEditing) {
                element.value =
                    documentState.document.content[node]?.content || '';
                state.wasEditing = true;
            } else if (!editing && state.wasEditing) {
                if (store.getValue().document.state.editing.savePreviousNode)
                    store.dispatch({
                        type: 'SET_NODE_CONTENT',
                        payload: {
                            nodeId: node,
                            content: element.value,
                        },
                    });
                state.wasEditing = false;
            }
        },
        destroy: () => {
            if (documentState.document.state.editing.savePreviousNode)
                store.dispatch({
                    type: 'SET_NODE_CONTENT',
                    payload: {
                        nodeId: node,
                        content: element.value,
                    },
                });
        },
    };
};
