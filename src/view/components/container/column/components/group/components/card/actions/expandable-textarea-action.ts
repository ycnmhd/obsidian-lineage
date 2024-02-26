export const expandableTextareaAction = (el: HTMLTextAreaElement) => {
    const listener = () => {
        el.style.height = 'auto';
        el.style.height = 3 + el.scrollHeight + 'px';
    };
    el.addEventListener('keydown', listener);

    const timeout = setTimeout(() => {
        listener();
    }, 0);
    return {
        destroy: () => {
            clearTimeout(timeout);
            el.removeEventListener('keydown', listener);
        },
    };
};
