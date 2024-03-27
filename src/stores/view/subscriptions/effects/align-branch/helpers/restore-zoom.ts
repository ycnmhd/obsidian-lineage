export const suspendZoom = (column: HTMLElement, columns: HTMLElement) => {
    const transform = columns.style.transform;
    columns.style.transform = 'none';
    const height = column.style.height;
    column.style.height = '100vh';
    return [transform, height];
};
export const restoreZoom = (
    column: HTMLElement,
    columns: HTMLElement,
    style: ReturnType<typeof suspendZoom>,
) => {
    columns.style.transform = style[0];
    column.style.height = style[1];
};
