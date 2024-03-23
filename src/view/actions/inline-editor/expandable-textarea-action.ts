const keys = new Set(['Backspace', 'Enter', 'Delete', ' ', 'v']);
export const adjustHeight = (el: HTMLElement, x: HTMLElement) => {
    const height = x.style.height;
    x.style.height = 'auto';
    el.style.height = x.scrollHeight + 'px';
    x.style.height = height;
};
export const expandableTextareaAction = (el: HTMLElement) => {
    let x: HTMLElement | null;
    const listener = (e: KeyboardEvent) => {
        if (e && !keys.has(e.key)) return;
        if (!x) x = el.querySelector('.cm-scroller');
        if (x) {
            adjustHeight(el, x);
        }
    };
    el.addEventListener('keydown', listener);

    return {
        destroy: () => {
            el.removeEventListener('keydown', listener);
        },
    };
};
