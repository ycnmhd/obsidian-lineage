const verticalScrollStep = 10;
const scrollDelay = 100;
const T = 20;

export const scrollOnDndY = (column: HTMLElement) => {
    let verticalScrollTimeout: number;
    let verticalScrollDirection = 0;
    let lastScrollTime = 0;

    const scrollVertically = (
        dir: number,
        bufferHeight: number,
        bufferBottom: number,
    ) => {
        const now = Date.now();
        if (now - lastScrollTime >= scrollDelay) {
            column.scrollTop += dir * verticalScrollStep;
            lastScrollTime = now;
        }
        if (stop(dir, bufferHeight, bufferBottom)) return;

        verticalScrollTimeout = requestAnimationFrame(() =>
            scrollVertically(dir, bufferHeight, bufferBottom),
        );
    };

    let container: HTMLElement | null = null;
    let buffer: Element | null = null;
    const stop = (dir: number, bufferHeight: number, bufferBottom: number) => {
        if (dir === -1) {
            return column.scrollTop + 50 <= bufferHeight;
        } else if (dir === 1) {
            return column.scrollTop - 50 >= bufferBottom - bufferHeight;
        }
    };
    const handleDragEnter = (event: DragEvent) => {
        if (!container) container = column.closest('#columns-container');
        if (!container) {
            return;
        }

        const containerRect = container.getBoundingClientRect();
        const y = event.clientY - containerRect.top;
        verticalScrollDirection =
            y < T ? -1 : y > containerRect.height - T ? 1 : 0;
        if (verticalScrollDirection !== 0) {
            if (verticalScrollDirection === -1) {
                buffer = column.firstElementChild;
            } else buffer = column.lastElementChild;
            if (!buffer) return;
            const bufferRect = buffer.getBoundingClientRect();
            scrollVertically(
                verticalScrollDirection,
                bufferRect.height,
                bufferRect.bottom,
            );
        }
    };

    const handleDragLeave = () => {
        cancelAnimationFrame(verticalScrollTimeout);
        verticalScrollDirection = 0;
    };

    column.addEventListener('dragenter', handleDragEnter);
    column.addEventListener('dragleave', handleDragLeave);

    return {
        destroy() {
            column.removeEventListener('dragenter', handleDragEnter);
            column.removeEventListener('dragleave', handleDragLeave);
        },
    };
};
