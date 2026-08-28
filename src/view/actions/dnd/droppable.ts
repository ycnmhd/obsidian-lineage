import { Direction } from 'src/stores/document/document-store-actions';
import { isId } from 'src/helpers/id';
import { getView } from 'src/view/components/container/context';

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

export const droppable = (node: HTMLElement, enabled = true) => {
    if (!enabled) return;
    const view = getView();
    const viewStore = view.viewStore;
    const documentStore = view.documentStore;

    function HandleDragLeave(event: DragEvent) {
        if (!(event.currentTarget instanceof HTMLElement)) return;
        event.currentTarget.removeClasses(classesList);
        event.currentTarget.removeClass('inactive-node-hover');
    }

    const handleDragOver = (event: DragEvent) => {
        event.preventDefault();
        if (!event.dataTransfer) return;
        const targetCard = event.currentTarget as HTMLElement;
        if (!targetCard.id.startsWith('n')) return;
        event.dataTransfer.dropEffect = 'move';

        const position = getDropPosition(event, targetCard);
        targetCard.removeClasses(classesList);
        if (position) {
            targetCard.addClass(dropClasses[position]);
            if (targetCard.hasClass('inactive-node'))
                targetCard.addClass('inactive-node-hover');
        }
    };

    function handleDrop(event: DragEvent) {
        event.preventDefault();
        if (!(event.currentTarget instanceof HTMLElement)) return;
        if (!event.dataTransfer) return;
        const data = event.dataTransfer.getData('text/plain');
        const targetCard = event.currentTarget as HTMLElement;
        if (!targetCard.id.startsWith('n')) return;
        targetCard.removeClasses(classesList);
        targetCard.removeClass('inactive-node-hover');
        if (!data) throw new Error(`droppedNodeId is missing`);
        if (!targetCard.id) throw new Error(`targetCard.id is missing`);
        const sections = documentStore.getValue().sections;
        if (isId.node(data) && sections.id_section[data]) {
            documentStore.dispatch({
                type: 'document/drop-node',
                payload: {
                    droppedNodeId: data,
                    targetNodeId: targetCard.id,
                    position: getDropPosition(event, targetCard) as Direction,
                },
            });
        } else if (!view.viewStore.getValue().document.editing.activeNodeId) {
            documentStore.dispatch({
                type: 'document/paste-node',
                payload: {
                    targetNodeId: targetCard.id,
                    text: data,
                    position: getDropPosition(event, targetCard) as Direction,
                },
            });
        }
        viewStore.dispatch({
            type: 'view/dnd/set-drag-ended',
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
