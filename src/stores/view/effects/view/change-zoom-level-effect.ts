import { ViewStore } from 'src/view/view';

export const changeZoomLevelEffect = (
    store: ViewStore,
    container: HTMLElement,
) => {
    const columnsContainer = container.querySelector('.columns') as HTMLElement;
    return store.subscribe((state, action) => {
        if (!action) return;
        if (action.type === 'UI/CHANGE_ZOOM_LEVEL') {
            const columns = Array.from(
                columnsContainer.querySelectorAll('.column'),
            ) as HTMLElement[];
            columnsContainer.style.transform = `scale(${state.ui.zoomLevel})`;
            for (const column of columns) {
                column.style.height = `${100 / state.ui.zoomLevel}vh`;
            }
        }
    });
};
