import { DocumentStore } from 'src/view/view';

export const saveDocumentEffect = (
    store: DocumentStore,
    save: (actionType: string) => Promise<void>,
) => {
    return store.subscribe(async (state, action) => {
        if (!action) return;

        if (
            action.type === 'SET_NODE_CONTENT' ||
            action.type === 'CREATE_NODE' ||
            action.type === 'DROP_NODE' ||
            action.type === 'APPLY_SNAPSHOT' ||
            action.type === 'TREE/DELETE_NODE' ||
            action.type === 'MERGE_NODE' ||
            action.type === 'MOVE_NODE'
        ) {
            await save(action.type);
        }
    });
};
