import { CommandHotkeys, HotkeyState } from 'src/stores/hotkeys/hotkey-store';
import { pluginCommands } from 'src/view/actions/keyboard-shortcuts/helpers/commands/load-commands';
import { CommandName } from 'src/view/actions/keyboard-shortcuts/helpers/commands/command-names';
import { updateHotkey } from 'src/stores/hotkeys/reducers/update-hotkey';
import { Hotkey } from 'obsidian';
import { CustomHotkeys } from 'src/stores/settings/settings-type';
import { commandToHotkeys } from 'src/stores/hotkeys/reducers/helpers/command-to-hotkeys';

export type LoadCustomHotkeysAction = {
    type: 'SETTINGS/LOAD_CUSTOM_HOTKEYS';
    payload: {
        customHotkeys: CustomHotkeys;
    };
};

export const loadCustomHotkeys = (
    state: HotkeyState,
    action: LoadCustomHotkeysAction,
) => {
    for (const [name, customHotkey] of Object.entries(
        action.payload.customHotkeys,
    )) {
        if (customHotkey.primary || customHotkey.secondary) {
            state.customHotkeys[name as CommandName] = customHotkey;
        }
    }
    if (!pluginCommands.current)
        throw new Error('plugin commands are undefined');
    state.hotkeys = [];
    for (const pluginCommand of pluginCommands.current) {
        const hotkey: CommandHotkeys = commandToHotkeys(pluginCommand);
        state.hotkeys.push(hotkey);
        const customHotkey = state.customHotkeys[hotkey.name];
        if (customHotkey) {
            updateHotkey(state, {
                type: 'HOTKEY/UPDATE',
                payload: {
                    command: hotkey.name,
                    hotkey: (customHotkey.primary ||
                        customHotkey.secondary) as Hotkey,
                    primary: !!customHotkey.primary,
                },
            });
        }
    }
};
