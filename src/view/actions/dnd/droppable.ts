import { DocumentStore } from 'src/view/view';
import { Direction } from 'src/stores/document/document-reducer';

const getDropPosition = (event: DragEvent, targetElement: HTMLElement) => {
    const boundingBox = targetElement.getBoundingClientRect();

    const mouseX = event.clientX;
    const mouseY = event.clientY;

    if (mouseY - boundingBox.top < boundingBox.height / 4) {
        return 'up';
    } else if (boundingBox.bottom - mouseY < boundingBox.height / 4)
        return 'down';
    else if (boundingBox.right - mouseX < boundingBox.width / 4) return 'right';
};

export const dropClasses = {
    up: 'lineage__drop-node-above',
    down: 'lineage__drop-node-below',
    right: 'lineage__drop-node-under',
};
const classesList = Object.values(dropClasses);
export const droppable = (node: HTMLElement, store: DocumentStore) => {
    function HandleDragLeave(event: DragEvent) {
        if (!(event.currentTarget instanceof HTMLElement)) return;
        event.currentTarget.removeClasses(classesList);
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
        if (!(event.currentTarget instanceof HTMLElement)) return;
        if (!event.dataTransfer) return;
        const data = event.dataTransfer.getData('text/plain');
        const targetCard = event.currentTarget as HTMLElement;
        if (!targetCard.id.startsWith('n-')) return;
        targetCard.removeClasses(classesList);
        if (!data) throw new Error(`droppedNodeId is missing`);
        if (!targetCard.id) throw new Error(`targetCard.id is missing`);
        store.dispatch({
            type: 'DROP_NODE',
            payload: {
                droppedNodeId: data,
                targetNodeId: targetCard.id,
                position: getDropPosition(event, targetCard) as Direction,
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
