import { Settings } from './settings-type';

export type SettingsActions =
    | {
          type: 'SET_DOCUMENT_TYPE_TO_TREE';
          payload: {
              path: string;
          };
      }
    | {
          type: 'SET_DOCUMENT_TYPE_TO_MARKDOWN';
          payload: {
              path: string;
          };
      }
    | {
          type: 'UPDATE_DOCUMENT_PATH';
          payload: {
              oldPath: string;
              newPath: string;
          };
      }
    | { type: 'TOGGLE_THEME' };

const updateState = (store: Settings, action: SettingsActions) => {
    if (action.type === 'SET_DOCUMENT_TYPE_TO_MARKDOWN') {
        delete store.documents[action.payload.path];
    } else if (action.type === 'SET_DOCUMENT_TYPE_TO_TREE') {
        store.documents[action.payload.path] = true;
    } else if (action.type === 'UPDATE_DOCUMENT_PATH') {
        delete store.documents[action.payload.oldPath];
        store.documents[action.payload.newPath] = true;
    } else if (action.type === 'TOGGLE_THEME') {
        store.ui.theme = store.ui.theme === 'light' ? 'dark' : 'light';
    }
};
export const settingsReducer = (
    store: Settings,
    action: SettingsActions,
): Settings => {
    updateState(store, action);
    return store;
};
