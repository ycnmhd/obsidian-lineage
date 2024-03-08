import { HotkeyState } from 'src/stores/hotkeys/hotkey-store';
import { hotkeyToString } from 'src/view/actions/keyboard-shortcuts/helpers/keyboard-events/hotkey-to-string';
import { Hotkey } from 'obsidian';
import { CommandName } from 'src/view/actions/keyboard-shortcuts/helpers/commands/command-names';

export type UpdateHotkeyAction = {
    type: 'HOTKEY/UPDATE';
    payload: {
        hotkey: Hotkey;
        command: CommandName;
        primary: boolean;
    };
};
export const updateHotkey = (
    state: HotkeyState,
    action: UpdateHotkeyAction,
) => {
    const commandHotkeys = state.hotkeys.find(
        (hotkey) => hotkey.name === action.payload.command,
    );
    if (!commandHotkeys) return;

    let customHotkeys = state.customHotkeys[action.payload.command];
    if (!customHotkeys) {
        customHotkeys = {};
        state.customHotkeys[action.payload.command] = customHotkeys;
    }
    const newHotkey = {
        modifiers: action.payload.hotkey.modifiers,
        key: action.payload.hotkey.key,
        string_representation: hotkeyToString(action.payload.hotkey),
    };
    const index = action.payload.primary ? 0 : 1;
    commandHotkeys.hotkeys[index] = newHotkey;
    if (action.payload.primary) {
        customHotkeys.primary = action.payload.hotkey;
    } else {
        customHotkeys.secondary = action.payload.hotkey;
    }
};
