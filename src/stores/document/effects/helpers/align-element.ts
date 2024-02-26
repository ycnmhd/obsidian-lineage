import { logger } from 'src/helpers/logger';

export type AlignBranchState = { columns: Set<HTMLElement> };
export const alignElement = (
    container: HTMLElement,
    id: string,
    behavior: ScrollBehavior = 'smooth',
    state: AlignBranchState,
    mode: 'vertical' | 'horizontal' | 'both' = 'vertical',
): HTMLElement | undefined => {
    if (!container) return;
    const element = container.querySelector('#' + id);
    if (!element) {
        logger.debug('could not find el for', id);
    } else {
        const column = element.matchParent('.column') as HTMLElement;
        if (column && !state.columns.has(column)) {
            const elementRect = element.getBoundingClientRect();
            const containerRect = (
                container.parentElement as HTMLElement
            ).getBoundingClientRect();
            if (mode === 'vertical' || mode === 'both') {
                const verticalMiddle = containerRect.height / 2;
                const scrollTop =
                    verticalMiddle -
                    (elementRect.top -
                        containerRect.top +
                        elementRect.height / 2);
                column.scrollBy({
                    top: scrollTop * -1,
                    behavior,
                });
            }
            if (mode === 'horizontal' || mode === 'both') {
                const horizontalMiddle = containerRect.width / 2;
                const scrollLeft =
                    horizontalMiddle -
                    (elementRect.left -
                        containerRect.left +
                        elementRect.width / 2);

                container.scrollBy({
                    left: scrollLeft * -1,
                    behavior,
                });
            }
            state.columns.add(column);
        }
    }
};
