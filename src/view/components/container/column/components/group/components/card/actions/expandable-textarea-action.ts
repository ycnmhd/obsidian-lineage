export const expandableTextareaAction = (el: HTMLTextAreaElement) => {
    const listener = () => {
        requestAnimationFrame(() => {
            el.style.height = 'auto';
            el.style.height = el.scrollHeight + 'px';
        });
    };
    el.addEventListener('keydown', listener);

    requestAnimationFrame(() => {
        listener();
    });
    return {
        destroy: () => {
            el.removeEventListener('keydown', listener);
        },
    };
};
