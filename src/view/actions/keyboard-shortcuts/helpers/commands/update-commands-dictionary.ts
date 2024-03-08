import { PluginCommand } from 'src/view/actions/keyboard-shortcuts/helpers/commands/command-names';
import { CommandHotkeys } from 'src/stores/hotkeys/hotkey-store';
import { pluginCommands } from 'src/view/actions/keyboard-shortcuts/helpers/commands/load-commands';
import { hotkeyToString } from 'src/view/actions/keyboard-shortcuts/helpers/keyboard-events/hotkey-to-string';

export enum Modifiers {
    'Alt' = 'Alt',
    'Ctrl' = 'Ctrl',
    'Shift' = 'Shift',
}

export const commandsDictionary: { current: Record<string, PluginCommand> } = {
    current: {},
};
export const updateCommandsDictionary = (pluginHotkeys: CommandHotkeys[]) => {
    if (!pluginCommands.current) return;
    const dictByName = Object.fromEntries(
        pluginCommands.current.map((command) => [command.name, command]),
    );
    commandsDictionary.current = {};
    for (const pluginHotkey of pluginHotkeys) {
        for (const hotkey of pluginHotkey.hotkeys) {
            commandsDictionary.current[hotkeyToString(hotkey)] = {
                ...dictByName[pluginHotkey.name],
                hotkeys: pluginHotkey.hotkeys,
            };
        }
    }
};
