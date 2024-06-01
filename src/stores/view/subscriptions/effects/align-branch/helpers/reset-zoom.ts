export const resetZoom = (container: HTMLElement) => {
    const columnsContainer = container.querySelector('.columns') as HTMLElement;
    columnsContainer.style.transform = 'none';
};
