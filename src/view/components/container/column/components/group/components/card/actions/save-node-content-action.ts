import { NodeId } from 'src/stores/view/view-state-type';
import { ViewStore } from 'src/view/view';
import { saveNodeContent } from 'src/view/actions/keyboard-shortcuts/helpers/tree/save-node-content';

export const activeTextArea: {
    element: HTMLTextAreaElement | null;
    nodeId: string | null;
} = {
    element: null,
    nodeId: null,
};

type Props = { editing: boolean; node: NodeId; store: ViewStore };
export const saveNodeContentAction = (
    element: HTMLTextAreaElement,
    { store, editing, node }: Props,
) => {
    const document = store.getValue().document;
    element.value = document.content[node]?.content || '';
    element.focus({ preventScroll: false });
    activeTextArea.element = element;
    activeTextArea.nodeId = node;
    return {
        destroy: () => {
            if (node === activeTextArea.nodeId) {
                saveNodeContent(store);
                activeTextArea.element = null;
                activeTextArea.nodeId = null;
            }
        },
    };
};
