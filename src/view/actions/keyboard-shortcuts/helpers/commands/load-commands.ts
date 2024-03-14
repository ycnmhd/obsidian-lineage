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
    isActiveAndNotEditing,
} from 'src/view/actions/keyboard-shortcuts/helpers/commands/commands/helpers/is-editing';
import { historyCommands } from 'src/view/actions/keyboard-shortcuts/helpers/commands/commands/history-commands';

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
        ...historyCommands(),
        {
            name: 'delete_card',
            check: isActiveAndNotEditing,
            callback: (store) => {
                store.dispatch({ type: 'DOCUMENT/DELETE_NODE' });
            },
            hotkeys: [{ key: 'Backspace', modifiers: ['Ctrl'] }],
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
