import Lineage from 'src/main';
import { PluginCommand } from 'src/view/actions/keyboard-shortcuts/helpers/commands/command-names';
import { hotkeyStore } from 'src/stores/hotkeys/hotkey-store';
import { navigateCommands } from 'src/view/actions/keyboard-shortcuts/helpers/commands/commands/navigate-commands';
import { editCommands } from 'src/view/actions/keyboard-shortcuts/helpers/commands/commands/edit-commands';
import { createCommands } from 'src/view/actions/keyboard-shortcuts/helpers/commands/commands/create-commands';
import { moveCommands } from 'src/view/actions/keyboard-shortcuts/helpers/commands/commands/move-commands';
import { mergeCommands } from 'src/view/actions/keyboard-shortcuts/helpers/commands/commands/merge-commands';
import {
    isActive,
    isActiveAndHasFile,
} from 'src/view/actions/keyboard-shortcuts/helpers/commands/commands/helpers/is-editing';

export const pluginCommands: {
    current: PluginCommand[] | null;
} = {
    current: null,
};

export const loadCommands = (plugin: Lineage) => {
    pluginCommands.current = [
        ...navigateCommands(),
        ...editCommands(plugin),
        ...createCommands(plugin),
        ...moveCommands(plugin),
        ...mergeCommands(plugin),
        {
            name: 'delete_card',
            check: isActive,
            callback: (store) => {
                store.dispatch({ type: 'DOCUMENT/DELETE_NODE' });
            },
            hotkeys: [{ key: 'Backspace', modifiers: ['Ctrl'] }],
        },

        {
            name: 'undo_change',
            check: isActiveAndHasFile,
            callback: (store) => {
                const path = store.getValue().file.path;
                if (path)
                    store.dispatch({
                        type: 'HISTORY/APPLY_PREVIOUS_SNAPSHOT',
                    });
            },
            hotkeys: [{ key: 'Z', modifiers: ['Ctrl', 'Shift'] }],
        },
        {
            name: 'redo_change',
            check: isActiveAndHasFile,
            callback: (store) => {
                const path = store.getValue().file.path;
                if (path)
                    store.dispatch({
                        type: 'HISTORY/APPLY_NEXT_SNAPSHOT',
                    });
            },
            hotkeys: [{ key: 'Y', modifiers: ['Ctrl', 'Shift'] }],
        },

        {
            name: 'toggle_search_input',
            check: isActive,
            callback: (store, e) => {
                e.preventDefault();
                e.stopPropagation();
                store.dispatch({ type: 'SEARCH/TOGGLE_INPUT' });
            },
            hotkeys: [{ key: '/', modifiers: [] }],
        },
    ];
    hotkeyStore.dispatch({
        type: 'SETTINGS/LOAD_CUSTOM_HOTKEYS',
        payload: {
            customHotkeys: plugin.settings.getValue().hotkeys.customHotkeys,
        },
    });
};
