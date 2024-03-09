import Lineage from 'src/main';
import { App, Command, Hotkey } from 'obsidian';
import { hotkeyToString } from 'src/view/actions/keyboard-shortcuts/helpers/keyboard-events/hotkey-to-string';

type ExtendedApp = App & {
    commands: {
        commands: Record<string, Command>;
        editorCommands: Record<string, Command>;
    };
    hotkeyManager: {
        customKeys: Record<string, Hotkey[]>;
    };
};

/* [hotkey_string]: command name */
export type ConflictingHotkeys = Map<string, string>;

export const getUsedHotkeys = (plugin: Lineage) => {
    const app = plugin.app as ExtendedApp;
    const conflicting: ConflictingHotkeys = new Map<string, string>();

    const allCommands = {
        ...app.commands.commands,
        ...app.commands.editorCommands,
    };
    const customHotkeys = Object.fromEntries(
        Object.entries(app.hotkeyManager.customKeys).map(
            ([name, hotkeys]) =>
                [
                    name,
                    { hotkeys, name: allCommands[name]?.name || name },
                ] as const,
        ),
    );

    const commands = {
        ...allCommands,
        ...customHotkeys,
    };
    for (const command of Object.values(commands)) {
        if (command.hotkeys?.length) {
            for (const hotkey of command.hotkeys) {
                const hotkey_string = hotkeyToString(hotkey);
                conflicting.set(hotkey_string, command.name);
            }
        }
    }
    return conflicting;
};
