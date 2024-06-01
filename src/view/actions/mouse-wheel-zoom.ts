import { LineageView } from 'src/view/view';
import { isMacLike } from 'src/view/actions/keyboard-shortcuts/helpers/keyboard-events/mod-key';

export const mouseWheelZoom = (element: HTMLElement, view: LineageView) => {
    const listener = (e: WheelEvent) => {
        const modKey = isMacLike ? e.metaKey : e.ctrlKey;
        if (!modKey) return;
        const delta = e.deltaY;
        view.plugin.settings.dispatch({
            type: 'UI/CHANGE_ZOOM_LEVEL',
            payload: {
                direction: delta < 0 ? 'in' : 'out',
            },
        });
    };
    element.addEventListener('wheel', listener);
    return {
        destroy: () => {
            element.removeEventListener('wheel', listener);
        },
    };
};
