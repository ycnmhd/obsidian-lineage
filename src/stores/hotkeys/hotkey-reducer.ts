import { HotkeyState } from 'src/stores/hotkeys/hotkey-store';
import {
    loadCustomHotkeys,
    LoadCustomHotkeysAction,
} from 'src/stores/hotkeys/reducers/load-custom-hotkeys';
import {
    updateHotkey,
    UpdateHotkeyAction,
} from 'src/stores/hotkeys/reducers/update-hotkey';
import {
    resetHotkey,
    ResetHotkeyAction,
} from 'src/stores/hotkeys/reducers/reset-hotkey';
import {
    updateConflictingHotkeys,
    UpdateConflictingHotkeysAction,
} from 'src/stores/hotkeys/reducers/update-conflicting-hotkeys';

export type SetSearchTermAction = {
    type: 'UI/SET_SEARCH_TERM';
    payload: {
        searchTerm: string;
    };
};
export type HotkeyAction =
    | SetSearchTermAction
    | LoadCustomHotkeysAction
    | UpdateHotkeyAction
    | ResetHotkeyAction
    | UpdateConflictingHotkeysAction;

const updateState = (state: HotkeyState, action: HotkeyAction) => {
    if (action.type === 'UI/SET_SEARCH_TERM') {
        state.searchTerm = action.payload.searchTerm.toLowerCase();
    } else if (action.type === 'SETTINGS/LOAD_CUSTOM_HOTKEYS') {
        loadCustomHotkeys(state, action);
    } else if (action.type === 'HOTKEY/UPDATE') {
        updateHotkey(state, action);
    } else if (action.type === 'HOTKEY/RESET') {
        resetHotkey(state, action);
    } else if (action.type === 'SET_CONFLICTING_HOTKEYS') {
        updateConflictingHotkeys(state, action);
    }
};

export const hotkeyReducer = (
    store: HotkeyState,
    action: HotkeyAction,
): HotkeyState => {
    updateState(store, action);
    return store;
};
