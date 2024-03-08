import { PluginCommand } from 'src/view/actions/keyboard-shortcuts/helpers/commands/command-names';
import { CommandHotkeys } from 'src/stores/hotkeys/hotkey-store';
import { hotkeyToString } from 'src/view/actions/keyboard-shortcuts/helpers/keyboard-events/hotkey-to-string';

export const commandToHotkeys = (command: PluginCommand): CommandHotkeys => {
    return {
        name: command.name,
        hotkeys: command.hotkeys.map((h) => ({
            string_representation: hotkeyToString(h),
            key: h.key,
            modifiers: [...h.modifiers],
        })),
    };
};
