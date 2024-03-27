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
        ...editCommands(),
        ...createCommands(),
        ...moveCommands(),
        ...mergeCommands(),
        ...historyCommands(),
        {
            name: 'delete_card',
            check: isActiveAndNotEditing,
            callback: (view) => {
                view.documentStore.dispatch({
                    type: 'DOCUMENT/DELETE_NODE',
                    payload: {
                        activeNodeId:
                            view.viewStore.getValue().document.activeNode,
                    },
                });
            },
            hotkeys: [{ key: 'Backspace', modifiers: ['Ctrl'] }],
        },
        {
            name: 'toggle_search_input',
            check: isActive,
            callback: (view, e) => {
                e.preventDefault();
                e.stopPropagation();
                view.viewStore.dispatch({ type: 'SEARCH/TOGGLE_INPUT' });
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
