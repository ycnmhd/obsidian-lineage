export const expandableTextareaAction = (el: HTMLTextAreaElement) => {
    const listener = () => {
        requestAnimationFrame(() => {
            el.style.height = 'auto';
            el.style.height = el.scrollHeight + 'px';
        });
    };
    el.addEventListener('keydown', listener);

    listener();

    return {
        destroy: () => {
            el.removeEventListener('keydown', listener);
        },
    };
};
