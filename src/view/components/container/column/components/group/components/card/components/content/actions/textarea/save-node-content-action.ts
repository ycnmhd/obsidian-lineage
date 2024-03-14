import { NodeId } from 'src/stores/view/view-state-type';
import { ViewStore } from 'src/view/view';

type Props = { node: NodeId; store: ViewStore };

export const saveNodeContentAction = (
    element: HTMLTextAreaElement,
    { store, node }: Props,
) => {
    const document = store.getValue().document;
    element.value = document.content[node]?.content || '';
    element.focus({ preventScroll: false });
    return {
        destroy: () => {
            if (element.dataset.discard !== 'true') {
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
