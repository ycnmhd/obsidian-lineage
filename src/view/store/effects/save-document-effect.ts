import { DocumentStore } from 'src/view/view';

export const saveDocumentEffect = (
    store: DocumentStore,
    save: (actionType: string) => Promise<void>,
) => {
    return store.subscribe(async (state, action) => {
        if (action) {
            if (
                action.type === 'SET_NODE_CONTENT' ||
                action.type === 'CREATE_FIRST_NODE' ||
                action.type === 'CREATE_NODE' ||
                action.type === 'DROP_NODE' ||
                action.type === 'APPLY_SNAPSHOT'
            ) {
                await save(action.type);
            }
        }
    });
};
