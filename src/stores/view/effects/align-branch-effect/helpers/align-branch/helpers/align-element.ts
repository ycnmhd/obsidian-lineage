import { getCombinedBoundingClientRect } from 'src/stores/view/effects/align-branch-effect/helpers/align-branch/helpers/get-combined-client-rect';

export type AlignBranchState = { columns: Set<string> };
export const alignElement = (
    container: HTMLElement,
    elements: HTMLElement | HTMLElement[],
    behavior: ScrollBehavior = 'smooth',
    mode: 'vertical' | 'horizontal' | 'both' = 'vertical',
) => {
    if (!container) return;
    const isArray = Array.isArray(elements);
    const element = isArray ? elements[0] : elements;
    const column = element.matchParent('.column') as HTMLElement;
    if (column) {
        const elementRect = isArray
            ? getCombinedBoundingClientRect(elements)
            : element.getBoundingClientRect();
        const containerRect = (
            container.parentElement as HTMLElement
        ).getBoundingClientRect();
        if (mode === 'vertical' || mode === 'both') {
            const verticalMiddle = containerRect.height / 2;
            const scrollTop =
                verticalMiddle -
                (elementRect.top - containerRect.top + elementRect.height / 2);
            column.scrollBy({
                top: scrollTop * -1,
                behavior,
            });
        }
        if (mode === 'horizontal' || mode === 'both') {
            const horizontalMiddle = containerRect.width / 2;
            const scrollLeft =
                horizontalMiddle -
                (elementRect.left - containerRect.left + elementRect.width / 2);

            container.scrollBy({
                left: scrollLeft * -1,
                behavior,
            });
        }
        return column.id;
    }
};
