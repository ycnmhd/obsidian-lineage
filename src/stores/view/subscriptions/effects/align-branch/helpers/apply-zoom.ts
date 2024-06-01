import { ViewState } from 'src/stores/view/view-state-type';
import { getNodeElement } from 'src/stores/view/subscriptions/effects/align-branch/helpers/get-node-element';
import invariant from 'tiny-invariant';

const calculateOffset = (container: HTMLElement, activeNode: HTMLElement) => {
    const elementRect = activeNode?.getBoundingClientRect();

    const containerRect = (
        container.parentElement as HTMLElement
    ).getBoundingClientRect();

    const horizontalMiddle = containerRect.left + containerRect.width / 2;
    const elementMiddle = elementRect.left + elementRect.width / 2;
    const scrollLeft = horizontalMiddle - elementMiddle;

    const verticalMiddle = containerRect.height / 2;
    const verticalElementMiddle = elementRect.top + elementRect.height / 2;
    const scrollTop = verticalMiddle - verticalElementMiddle;
    return { scrollLeft, scrollTop };
};

const adjustColumnsHeight = (
    viewState: ViewState,
    columnsContainer: HTMLElement,
) => {
    const columns = Array.from(
        columnsContainer.querySelectorAll('.column'),
    ) as HTMLElement[];
    for (const column of columns) {
        column.style.height = `${100 / viewState.ui.zoomLevel}vh`;
    }
};

const adjustSkewedCenter = (
    viewState: ViewState,
    container: HTMLElement,
    columnsContainer: HTMLElement,
) => {
    const activeNodeId = viewState.document.activeNode;
    const activeNode = getNodeElement(container, activeNodeId);
    invariant(activeNode);
    const offset = calculateOffset(container, activeNode);

    const scaledOffsetLeft = offset.scrollLeft / viewState.ui.zoomLevel;
    const scaledOffsetTop = (offset.scrollTop + 100) / viewState.ui.zoomLevel;

    columnsContainer.style.transform = `scale(${viewState.ui.zoomLevel}) translate(${scaledOffsetLeft}px,${scaledOffsetTop}px)`;
};

export const applyZoom = (
    viewState: ViewState,
    container: HTMLElement,
    adjustColumns = false,
) => {
    const columnsContainer = container.querySelector('.columns') as HTMLElement;

    requestAnimationFrame(() => {
        if (viewState.ui.zoomLevel === 1) {
            columnsContainer.style.transform = 'none';
        } else {
            columnsContainer.style.transform = `scale(${viewState.ui.zoomLevel}) `;
            if (adjustColumns) adjustColumnsHeight(viewState, columnsContainer);
            adjustSkewedCenter(viewState, container, columnsContainer);
        }
    });
};
