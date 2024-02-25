export const expandableTextareaAction = (el: HTMLTextAreaElement) => {
    const listener = () => {
        el.style.height = 'auto';
        el.style.height = el.scrollHeight + 'px';
    };
    el.addEventListener('keydown', listener);

    return {
        destroy: () => {
            el.removeEventListener('keydown', listener);
        },
    };
};
