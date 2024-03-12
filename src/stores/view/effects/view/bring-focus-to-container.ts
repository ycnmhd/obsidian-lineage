import { ViewStore } from 'src/view/view';

export const bringFocusToContainer = (
    store: ViewStore,
    container: HTMLElement,
) => {
    return store.subscribe((store, action) => {
        if (!action) return;
        if (
            action.type === 'DOCUMENT/DISABLE_EDIT_MODE' ||
            action.type === 'DOCUMENT/MOVE_NODE'
        ) {
            container?.focus();
        }
    });
};
