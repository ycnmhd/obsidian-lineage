export const scrollTextAreaAction = (textArea: HTMLTextAreaElement) => {
    requestAnimationFrame(() => {
        textArea.scrollTop = textArea.scrollHeight;
        const columnElement = textArea.matchParent('.column') as HTMLElement;
        const containerElement = columnElement.matchParent(
            '.container',
        ) as HTMLElement;
        const containerRect = containerElement.getBoundingClientRect();
        const textRect = textArea.getBoundingClientRect();

        const delta = textRect.bottom - containerRect.bottom + 50;
        if (delta > 0) {
            columnElement.scrollBy({
                top: delta,
            });
        }
    });
    return {
        destroy: () => {},
    };
};
