const horizontalScrollStep = 25;
const scrollDelay = 200;

export const scrollOnDndX = (node: HTMLElement) => {
    let horizontalScrollTimeout: number;
    let horizontalScrollDirection = 0;
    let lastScrollTime = 0;

    const scrollHorizontally = (dir: number) => {
        const now = Date.now();
        if (now - lastScrollTime >= scrollDelay) {
            node.scrollLeft += dir * horizontalScrollStep;
            lastScrollTime = now;
        }
        horizontalScrollTimeout = requestAnimationFrame(() =>
            scrollHorizontally(dir),
        );
    };

    const handleDragEnter = (event: DragEvent) => {
        const rect = node.getBoundingClientRect();
        const x = event.clientX - rect.left;

        horizontalScrollDirection = x < 50 ? -1 : x > rect.width - 50 ? 1 : 0;

        if (horizontalScrollDirection !== 0) {
            scrollHorizontally(horizontalScrollDirection);
        }
    };

    const handleDragLeave = () => {
        cancelAnimationFrame(horizontalScrollTimeout);
        horizontalScrollDirection = 0;
    };

    node.addEventListener('dragenter', handleDragEnter);
    node.addEventListener('dragleave', handleDragLeave);

    return {
        destroy() {
            node.removeEventListener('dragenter', handleDragEnter);
            node.removeEventListener('dragleave', handleDragLeave);
        },
    };
};
