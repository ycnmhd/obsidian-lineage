import { relativeTime } from 'src/helpers/relative-time';

export const updateRelativeTime = (element: HTMLElement) => {
    const interval = setInterval(() => {
        const children = Array.from(
            element.querySelectorAll('[data-created]'),
        ) as HTMLElement[];
        for (const child of children) {
            const created = child.dataset['created'];
            if (created && !isNaN(+created))
                child.textContent = relativeTime(+created);
        }
    }, 30 * 1000);
    return {
        destroy: () => {
            clearInterval(interval);
        },
    };
};
