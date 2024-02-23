import { DocumentStore } from 'src/view/view';

export const bringFocusToContainer = (store: DocumentStore) => {
    return store.subscribe((store, action) => {
        if (!action) return;
        if (action.type === 'DISABLE_EDIT_MODE') {
            store.refs.container?.focus();
        }
    });
};
