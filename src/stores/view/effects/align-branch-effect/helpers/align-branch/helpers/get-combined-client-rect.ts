export const getCombinedBoundingClientRect = (
    elements: HTMLElement[],
): DOMRect => {
    if (elements.length === 0) {
        return new DOMRect(0, 0, 0, 0);
    }

    let combinedRect = elements[0].getBoundingClientRect();

    for (let i = 1; i < elements.length; i++) {
        const rect = elements[i].getBoundingClientRect();
        combinedRect = combineRects(combinedRect, rect);
    }

    return combinedRect;
};

const combineRects = (rect1: DOMRect, rect2: DOMRect): DOMRect => {
    const left = Math.min(rect1.left, rect2.left);
    const top = Math.min(rect1.top, rect2.top);
    const right = Math.max(rect1.right, rect2.right);
    const bottom = Math.max(rect1.bottom, rect2.bottom);
    const width = right - left;
    const height = bottom - top;

    return new DOMRect(left, top, width, height);
};
