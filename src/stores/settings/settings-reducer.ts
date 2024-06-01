import { CustomHotkeys, ScrollingMode, Settings } from './settings-type';
import {
    changeZoomLevel,
    ChangeZoomLevelAction,
} from 'src/stores/settings/reducers/change-zoom-level';

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
          type: 'HISTORY/UPDATE_DOCUMENT_PATH';
          payload: {
              oldPath: string;
              newPath: string;
          };
      }
    | {
          type: 'SET_CUSTOM_HOTKEYS';
          payload: {
              customHotkeys: CustomHotkeys;
          };
      }
    | {
          type: 'SET_FONT_SIZE';
          payload: {
              fontSize: number;
          };
      }
    | {
          type: 'SET_CONTAINER_BG';
          payload: {
              backgroundColor: string | undefined;
          };
      }
    | {
          type: 'SET_ACTIVE_BRANCH_BG';
          payload: {
              backgroundColor: string | undefined;
          };
      }
    | {
          type: 'SET_CARD_WIDTH';
          payload: {
              width: number;
          };
      }
    | {
          type: 'SET_MIN_CARD_HEIGHT';
          payload: {
              height: number | undefined;
          };
      }
    | {
          type: 'SET_HORIZONTAL_SCROLLING_MODE';
          payload: {
              mode: ScrollingMode;
          };
      }
    | {
          type: 'UPDATE_AXIS_OFFSET';
          payload: {
              relativeClientX: number;
              relativeClientY: number;
          };
      }
    | {
          type: 'SET_LIMIT_PREVIEW_HEIGHT';
          payload: {
              limit: boolean;
          };
      }
    | {
          type: 'BACKUP/ADD_FILE';
          payload: {
              content: string;
              path: string;
          };
      }
    | {
          type: 'BACKUP/DELETE_FILE';
          payload: {
              path: string;
          };
      }
    | {
          type: 'UPDATE_DOCUMENTS_DICTIONARY';
          payload: {
              documents: Record<string, true>;
          };
      }
    | ChangeZoomLevelAction;

const updateState = (store: Settings, action: SettingsActions) => {
    if (action.type === 'SET_DOCUMENT_TYPE_TO_MARKDOWN') {
        delete store.documents[action.payload.path];
    } else if (action.type === 'SET_DOCUMENT_TYPE_TO_TREE') {
        store.documents[action.payload.path] = true;
    } else if (action.type === 'HISTORY/UPDATE_DOCUMENT_PATH') {
        delete store.documents[action.payload.oldPath];
        store.documents[action.payload.newPath] = true;
    } else if (action.type === 'SET_CUSTOM_HOTKEYS') {
        store.hotkeys.customHotkeys = action.payload.customHotkeys;
    } else if (action.type === 'SET_FONT_SIZE') {
        store.view.fontSize = action.payload.fontSize;
    } else if (action.type === 'SET_CONTAINER_BG') {
        store.view.theme.containerBg = action.payload.backgroundColor;
    } else if (action.type === 'SET_ACTIVE_BRANCH_BG') {
        store.view.theme.activeBranchBg = action.payload.backgroundColor;
    } else if (action.type === 'SET_CARD_WIDTH') {
        store.view.cardWidth = action.payload.width;
    } else if (action.type === 'SET_MIN_CARD_HEIGHT') {
        store.view.minimumCardHeight = action.payload.height;
    } else if (action.type === 'SET_HORIZONTAL_SCROLLING_MODE') {
        store.view.scrolling.horizontalScrollingMode = action.payload.mode;
    } else if (action.type === 'UPDATE_AXIS_OFFSET') {
        store.view.scrolling.horizontalOffset = action.payload.relativeClientX;
        store.view.scrolling.verticalOffset = action.payload.relativeClientY;
    } else if (action.type === 'SET_LIMIT_PREVIEW_HEIGHT') {
        store.view.limitPreviewHeight = action.payload.limit;
    } else if (action.type === 'BACKUP/ADD_FILE') {
        store.backup[action.payload.path] = {
            content: action.payload.content,
            created: Date.now(),
        };
    } else if (action.type === 'BACKUP/DELETE_FILE') {
        if (store.backup[action.payload.path])
            delete store.backup[action.payload.path];
    } else if (action.type === 'UPDATE_DOCUMENTS_DICTIONARY') {
        store.documents = action.payload.documents;
    } else if (action.type === 'UI/CHANGE_ZOOM_LEVEL') {
        changeZoomLevel(store, action.payload);
    }
};
export const settingsReducer = (
    store: Settings,
    action: SettingsActions,
): Settings => {
    updateState(store, action);
    return store;
};
