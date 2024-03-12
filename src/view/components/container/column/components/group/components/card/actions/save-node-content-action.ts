import { NodeId } from 'src/stores/view/view-state-type';
import { ViewStore } from 'src/view/view';

type Props = { editing: boolean; node: NodeId; store: ViewStore };
export const saveNodeContentAction = (
    element: HTMLTextAreaElement,
    { store, editing, node }: Props,
) => {
    const document = store.getValue().document;
    element.value = document.content[node]?.content || '';
    element.focus({ preventScroll: false });
    return {
        destroy: () => {
            if (store.getValue().ui.state.editing.activeNodeId === node) {
                store.dispatch({
                    type: 'DOCUMENT/SET_NODE_CONTENT',
                    payload: {
                        nodeId: node,
                        content: element.value,
                    },
                });
            }
        },
    };
};
