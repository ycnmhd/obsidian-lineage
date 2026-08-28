import { PluginStoreActions } from 'src/stores/plugin/plugin-store-actions';
import { PluginState } from 'src/stores/plugin/plugin-state-type';
import { defaultDocumentState } from 'src/stores/document/default-document-state';

const updateState = (state: PluginState, action: PluginStoreActions) => {
    if (action.type === 'plugin/documents/unregister-document-store') {
        const path = action.payload.path;
        if (path in state.documents) {
            const oldEntry = state.documents[path];
            oldEntry.documentStore.set(defaultDocumentState());
            delete state.documents[path];
        }
    } else if (action.type === 'plugin/documents/update-document-path') {
        const oldPath = action.payload.oldPath;
        const newPath = action.payload.newPath;
        if (oldPath in state.documents) {
            const oldEntry = state.documents[oldPath];
            delete state.documents[oldPath];
            state.documents[newPath] = oldEntry;
        }
    } else if (action.type === 'plugin/documents/register-new-document-store') {
        state.documents[action.payload.path] = {
            documentStore: action.payload.documentStore,
            viewId: action.payload.viewId,
        };
    } else if (
        action.type === 'plugin/documents/update-active-view-of-document'
    ) {
        if (state.documents[action.payload.path]) {
            state.documents[action.payload.path].viewId = action.payload.viewId;
        }
    } else if (
        action.type === 'plugin/documents/refresh-active-view-of-document'
    ) {
        for (const [viewId, filePath] of action.payload.views) {
            if (state.documents[filePath]) {
                state.documents[filePath].viewId = viewId;
            }
        }
    } else if (action.type === 'plugin/zen/toggle') {
        state.zenMode = !state.zenMode;
    }
};

export const pluginReducer = (
    store: PluginState,
    action: PluginStoreActions,
): PluginState => {
    updateState(store, action);
    return store;
};
