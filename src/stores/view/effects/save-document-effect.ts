import { ViewStore } from 'src/view/view';

import {
    historyEvents,
    structureAndContentEvents,
} from 'src/stores/view/helpers/state-events';

export const saveDocumentEffect = (
    store: ViewStore,
    save: (actionType: string) => Promise<void>,
) => {
    return store.subscribe(async (state, action) => {
        if (!action) return;

        if (
            structureAndContentEvents.has(action.type) ||
            historyEvents.has(action.type)
        ) {
            await save(action.type);
        }
    });
};
