import { ViewState } from 'src/stores/view/view-state-type';

export const applyZoom = (container: HTMLElement, viewState: ViewState) => {
    const columnsContainer = container.querySelector('.columns') as HTMLElement;
    const columns = Array.from(
        columnsContainer.querySelectorAll('.column'),
    ) as HTMLElement[];
    columnsContainer.style.transform = `scale(${viewState.ui.zoomLevel})`;
    for (const column of columns) {
        column.style.height = `${100 / viewState.ui.zoomLevel}vh`;
    }
};
