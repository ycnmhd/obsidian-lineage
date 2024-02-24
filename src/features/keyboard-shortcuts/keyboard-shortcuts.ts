import { DocumentStore } from 'src/view/view';
import {
    createCommands,
    PluginCommand,
} from 'src/features/keyboard-shortcuts/helpers/create-commands';
import { Hotkey } from 'obsidian';

enum Modifiers {
    'Alt' = 'Alt',
    'Ctrl' = 'Ctrl',
    'Shift' = 'Shift',
}

const eventToString = (event: KeyboardEvent) => {
    let string = event.key;
    if (event.altKey) string += Modifiers.Alt;
    if (event.ctrlKey) string += Modifiers.Ctrl;
    if (event.shiftKey) string += Modifiers.Shift;
    return string;
};

const hotkeyToString = (hotkey: Hotkey) =>
    hotkey.key + hotkey.modifiers.sort().join('');

/* using native obsidian hotkeys is not practical because (1) the plugin uses basic
 * hotkeys such as 'ArrowUp' and 'Ctrl+Enter' and (2) the plugin only listens to hotkeys in its
 * custom view */
export const keyboardShortcuts = (
    target: HTMLElement,
    store: DocumentStore,
) => {
    const event = 'keydown';

    const commands = createCommands();

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
            if (command.check(store)) command.callback(store);
        }
    };
    target.addEventListener(event, keyboardEventHandler);

    return {
        destroy: () => {
            target.removeEventListener(event, keyboardEventHandler);
        },
    };
};
