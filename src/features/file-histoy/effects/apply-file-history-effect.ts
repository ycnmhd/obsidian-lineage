import { fileHistoryStore } from 'src/features/file-histoy/file-history-store';
import { stores } from 'src/view/helpers/stores-cache';

export const applyFileHistoryEffect = () => {
    return fileHistoryStore.subscribe((state, action) => {
        if (!action) return;
        if (
            action.type === 'UNDO_REDO_SNAPSHOT' ||
            action.type === 'SELECT_SNAPSHOT'
        ) {
            const path = action.payload.path;
            const store = stores[path];
            if (!store) throw new Error(`store is undefined: ${path}`);
            const document = state.documents[path];

            const snapshot = document.snapshots[document.state.activeIndex];
            if (!snapshot)
                throw new Error(
                    `snapshot not found: ${JSON.stringify(document)}`,
                );

            store.dispatch({
                type: 'APPLY_SNAPSHOT',
                payload: {
                    document: {
                        data: snapshot.data,
                        position: snapshot.position,
                    },
                },
            });
        }
    });
};
