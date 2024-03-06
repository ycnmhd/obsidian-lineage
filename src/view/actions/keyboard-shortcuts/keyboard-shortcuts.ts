import { ViewStore } from 'src/view/view';
import Lineage from 'src/main';
import { eventToString } from 'src/view/actions/keyboard-shortcuts/helpers/keyboard-events/event-to-string';
import {
    createCommands,
    PluginCommand,
} from 'src/view/actions/keyboard-shortcuts/helpers/create-commands';
import { hotkeyToString } from 'src/view/actions/keyboard-shortcuts/helpers/keyboard-events/hotkey-to-string';

export enum Modifiers {
    'Alt' = 'Alt',
    'Ctrl' = 'Ctrl',
    'Shift' = 'Shift',
}

/* using native obsidian hotkeys is not practical because (1) the plugin uses basic
 * hotkeys such as 'ArrowUp' and 'Ctrl+Enter' and (2) the plugin only listens to hotkeys in its
 * custom view */
export const keyboardShortcuts = (
    target: HTMLElement,
    {
        store,
        plugin,
    }: {
        store: ViewStore;
        plugin: Lineage;
    },
) => {
    const event = 'keydown';

    const commands = createCommands(plugin);

    const commandsDictionary: Record<string, PluginCommand> = {};
    for (const command of Object.values(commands)) {
        for (const hotkey of command.hotkeys) {
            commandsDictionary[hotkeyToString(hotkey)] = command;
        }
    }

    const keyboardEventHandler = (event: Event) => {
        if (!(event instanceof KeyboardEvent)) return;
        const command = commandsDictionary[eventToString(event)];
        if (command) {
            if (command.check(store)) command.callback(store, event);
        }
    };
    target.addEventListener(event, keyboardEventHandler);

    return {
        destroy: () => {
            target.removeEventListener(event, keyboardEventHandler);
        },
    };
};
