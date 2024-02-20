import { container } from 'src/view/components/container/ref';
import { logger } from 'src/helpers/logger';

export const alignElement = (id: string) => {
    if (!container.current) return;
    const element = container.current.querySelector('#' + id);
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
                behavior: 'smooth',
            });
        }
    }
};
