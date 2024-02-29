import { DocumentStore } from 'src/view/view';

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
    store: DocumentStore;
};

export const draggable = (node: HTMLElement, data: DraggableData) => {
    node.draggable = true;

    const handleDragstart = (event: DragEvent) => {
        if (!event.dataTransfer) return;
        const target = event.currentTarget as HTMLElement;
        if (event.clientX - target.getBoundingClientRect().x > 12) {
            event.preventDefault();
        } else {
            event.dataTransfer.setData('text/plain', data.id);
            setTimeout(() => {
                data.store.dispatch({
                    type: 'SET_DRAG_STARTED',
                    payload: { nodeId: data.id },
                });
                toggleDraggedNodeVisibility(node, data, false);
            }, 0);
        }
    };

    node.addEventListener('dragstart', handleDragstart);
    const handleDragEnd = (e: DragEvent) => {
        data.store.dispatch({ type: 'SET_DRAG_CANCELED' });
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
