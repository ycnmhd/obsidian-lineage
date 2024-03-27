import { DocumentStore, ViewStore } from 'src/view/view';
import { NodeId } from 'src/stores/document/document-state-type';
import { traverseDown } from 'src/stores/view/helpers/search/traverse-down';

const toggleDraggedNodeVisibility = (
    node: HTMLElement,
    data: DraggableData,
    visible: boolean,
) => {
    requestAnimationFrame(() => {
        const parent = node.matchParent('#' + data.id) as HTMLElement;
        if (parent) {
            parent.style.display = visible ? 'flex' : 'none';
        }
    });
};

export type DraggableData = {
    id: string;
    documentStore: DocumentStore;
    viewStore: ViewStore;
};

export const draggable = (node: HTMLElement, data: DraggableData) => {
    node.draggable = true;

    const handleDragstart = (event: DragEvent) => {
        if (!event.dataTransfer) return;
        const target = event.currentTarget as HTMLElement;
        if (
            event.clientX - target.getBoundingClientRect().x <= 5 ||
            target.dataset['test'] === 'true'
        ) {
            event.dataTransfer.setData('text/plain', data.id);
            setTimeout(() => {
                const childGroups: NodeId[] = [];
                traverseDown(
                    childGroups,
                    data.documentStore.getValue().document.columns,
                    data.id,
                );
                data.viewStore.dispatch({
                    type: 'SET_DRAG_STARTED',
                    payload: { nodeId: data.id, childGroups },
                });
                toggleDraggedNodeVisibility(node, data, false);
            }, 0);
        } else {
            event.preventDefault();
        }
    };

    node.addEventListener('dragstart', handleDragstart);
    const handleDragEnd = () => {
        data.viewStore.dispatch({ type: 'DOCUMENT/SET_DRAG_ENDED' });
        toggleDraggedNodeVisibility(node, data, true);
    };
    node.addEventListener('dragend', handleDragEnd);

    return {
        destroy: () => {
            node.removeEventListener('dragstart', handleDragstart);
            node.removeEventListener('dragend', handleDragEnd);
        },
    };
};
