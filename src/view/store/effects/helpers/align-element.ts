import { logger } from 'src/helpers/logger';

export const alignElement = (
    container: HTMLElement,
    id: string,
    behavior: ScrollBehavior = 'smooth',
) => {
    if (!container) return;
    const element = container.querySelector('#' + id);
    if (!element) {
        logger.debug('could not find el for', id);
    } else {
        const container = element.matchParent('#columns-container');
        const column = element.matchParent('.column');
        if (container && column) {
            const cardRect = element.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            const middle = containerRect.height / 2;
            const scrollTop = middle - cardRect.top;
            column.scrollBy({
                top: scrollTop * -1,
                behavior,
            });
        }
    }
};
