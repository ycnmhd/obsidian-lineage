import { ViewStore } from 'src/view/view';

import { getViewEventType } from 'src/stores/view/helpers/get-view-event-type';

export const saveDocumentEffect = (
    store: ViewStore,
    save: (actionType: string) => Promise<void>,
) => {
    return store.subscribe(async (state, action) => {
        if (!action) return;

        const event = getViewEventType(action.type);
        if (
            event.creationAndDeletion ||
            event.shape ||
            event.content ||
            event.changeHistory
        ) {
            await save(action.type);
        }
    });
};
