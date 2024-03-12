import { ViewStore } from 'src/view/view';
import Lineage from 'src/main';
import { eventToString } from 'src/view/actions/keyboard-shortcuts/helpers/keyboard-events/event-to-string';
import { hotkeyStore } from 'src/stores/hotkeys/hotkey-store';
import {
    commandsDictionary,
    updateCommandsDictionary,
} from 'src/view/actions/keyboard-shortcuts/helpers/commands/update-commands-dictionary';
import { Notice } from 'obsidian';

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

    const unsubscribeFromHotkeyStore = hotkeyStore.subscribe(
        (state, action, initialRun) => {
            if (
                action?.type === 'HOTKEY/UPDATE' ||
                action?.type === 'HOTKEY/RESET' ||
                initialRun
            )
                updateCommandsDictionary(state.hotkeys);
        },
    );
    const keyboardEventHandler = (event: Event) => {
        if (!(event instanceof KeyboardEvent)) return;
        const command = commandsDictionary.current[eventToString(event)];
        if (command) {
            if (command.check(store)) {
                try {
                    command.callback(store, event);
                } catch (error) {
                    // eslint-disable-next-line no-console
                    console.error(`[hotkey] command: `, command.name);
                    // eslint-disable-next-line no-console
                    console.error(`[hotkey] `, error);
                    new Notice('Lineage plugin: ' + error.message);
                }
            }
        }
    };

    target.addEventListener(event, keyboardEventHandler);

    return {
        destroy: () => {
            unsubscribeFromHotkeyStore();
            target.removeEventListener(event, keyboardEventHandler);
        },
    };
};
