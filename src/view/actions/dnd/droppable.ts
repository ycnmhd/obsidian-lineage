import { DocumentStore } from 'src/view/view';
import { NodeDirection } from 'src/stores/document/document-reducer';

const getDropPosition = (event: DragEvent, targetElement: HTMLElement) => {
    const boundingBox = targetElement.getBoundingClientRect();

    const mouseX = event.clientX;
    const mouseY = event.clientY;

    if (mouseY - boundingBox.top < boundingBox.height / 4) {
        return 'top';
    } else if (boundingBox.bottom - mouseY < boundingBox.height / 4)
        return 'bottom';
    else if (boundingBox.right - mouseX < boundingBox.width / 4) return 'right';
};

export const dropClasses = {
    top: 'drop-node-above',
    bottom: 'drop-node-below',
    right: 'drop-node-under',
};
const classesList = Object.values(dropClasses);
export const droppable = (node: HTMLElement, store: DocumentStore) => {
    function HandleDragLeave(event: DragEvent) {
        if (!(event.target instanceof HTMLElement)) return;
        event.target.removeClasses(classesList);
    }

    const handleDragOver = (event: DragEvent) => {
        event.preventDefault();
        if (!event.dataTransfer) return;
        const targetCard = event.currentTarget as HTMLElement;
        if (!targetCard.id.startsWith('n-')) return;
        event.dataTransfer.dropEffect = 'move';

        const position = getDropPosition(event, targetCard);
        targetCard.removeClasses(classesList);
        if (position) {
            targetCard.addClass(dropClasses[position]);
        }
    };

    function handleDrop(event: DragEvent) {
        event.preventDefault();
        if (!event.dataTransfer) return;
        if (!(event.target instanceof HTMLElement)) return;
        const data = event.dataTransfer.getData('text/plain');
        event.target.removeClasses(classesList);
        store.dispatch({
            type: 'DROP_NODE',
            payload: {
                droppedNodeId: data,
                targetNodeId: event.target.id,
                position: getDropPosition(event, event.target) as NodeDirection,
            },
        });
    }

    node.addEventListener('dragleave', HandleDragLeave);
    node.addEventListener('dragover', handleDragOver);
    node.addEventListener('drop', handleDrop);

    return {
        destroy() {
            node.removeEventListener('dragleave', HandleDragLeave);
            node.removeEventListener('dragover', handleDragOver);
            node.removeEventListener('drop', handleDrop);
        },
    };
};
