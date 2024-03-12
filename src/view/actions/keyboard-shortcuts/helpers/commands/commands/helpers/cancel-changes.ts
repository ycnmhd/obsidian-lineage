import { ViewStore } from 'src/view/view';

export const cancelChanges = (store: ViewStore) => {
    store.dispatch({
        type: 'DOCUMENT/DISABLE_EDIT_MODE',
    });
};
