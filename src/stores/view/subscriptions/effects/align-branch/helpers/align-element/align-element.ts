import { getCombinedBoundingClientRect } from 'src/stores/view/subscriptions/effects/align-branch/helpers/get-combined-client-rect';
import { Settings } from 'src/stores/settings/settings-type';
import { calculateScrollTop } from 'src/stores/view/subscriptions/effects/align-branch/helpers/align-element/helpers/calculate-scroll-top';
import { calculateScrollLeft } from 'src/stores/view/subscriptions/effects/align-branch/helpers/align-element/helpers/calculate-scroll-left';

export type AlignBranchState = { columns: Set<string> };

export const THRESHOLD = 5;

export const alignElement = (
    container: HTMLElement,
    elements: HTMLElement | HTMLElement[],
    settings: Settings,
    behavior: ScrollBehavior = 'smooth',
    mode: 'vertical' | 'horizontal' | 'both' = 'vertical',
    horizontalChild?: HTMLElement,
) => {
    if (!container) return;
    const isArray = Array.isArray(elements);
    const element = isArray ? elements[0] : elements;
    if (!element) return;
    const column = element.matchParent('.column') as HTMLElement;

    if (column) {
        const elementRect = isArray
            ? getCombinedBoundingClientRect(elements)
            : element.getBoundingClientRect();
        const containerRect = (
            container.parentElement as HTMLElement
        ).getBoundingClientRect();

        if (mode === 'horizontal' || mode === 'both') {
            const childRect = horizontalChild
                ? horizontalChild.getBoundingClientRect()
                : null;
            const scrollLeft = calculateScrollLeft(
                elementRect,
                containerRect,
                settings.view.scrolling,
                childRect,
            );
            if (Math.abs(scrollLeft) > THRESHOLD)
                container.scrollBy({
                    left: scrollLeft * -1,
                    behavior,
                });
        }

        if (mode === 'vertical' || mode === 'both') {
            const scrollTop = calculateScrollTop(
                elementRect,
                containerRect,
                settings.view.scrolling,
            );
            if (Math.abs(scrollTop) > THRESHOLD)
                column.scrollBy({
                    top: scrollTop * -1,
                    behavior,
                });
        }

        return column.id;
    }
};
