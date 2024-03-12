import { HotkeyState } from 'src/stores/hotkeys/hotkey-store';
import { pluginCommands } from 'src/view/actions/keyboard-shortcuts/helpers/commands/load-commands';

import { commandToHotkeys } from 'src/stores/hotkeys/reducers/helpers/command-to-hotkeys';
import { CommandName } from 'src/view/actions/keyboard-shortcuts/helpers/commands/command-names';

export type ResetHotkeyAction = {
    type: 'HOTKEY/RESET';
    payload: {
        command: CommandName;
        primary: boolean;
    };
};
export const resetHotkey = (state: HotkeyState, action: ResetHotkeyAction) => {
    const hotkey = state.hotkeys.find(
        (hotkey) => hotkey.name === action.payload.command,
    );
    if (!hotkey) return;
    if (pluginCommands.current) {
        const command = pluginCommands.current.find(
            (command) => command.name === action.payload.command,
        );
        if (command) {
            const defaultHotkeys = commandToHotkeys(command).hotkeys;
            const index = action.payload.primary ? 0 : 1;
            hotkey.hotkeys[index] = defaultHotkeys[index];
            const customHotkeys = state.customHotkeys[action.payload.command];
            if (customHotkeys)
                if (action.payload.primary) {
                    delete customHotkeys.primary;
                } else {
                    delete customHotkeys.secondary;
                }
        }
    }
};
