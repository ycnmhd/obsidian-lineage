import { getActiveLineageView } from 'src/view/actions/keyboard-shortcuts/helpers/commands/commands/helpers/get-active-lineage-view';
import { saveNodeContent } from 'src/view/actions/keyboard-shortcuts/helpers/commands/commands/helpers/save-node-content';
import { cancelChanges } from 'src/view/actions/keyboard-shortcuts/helpers/commands/commands/helpers/cancel-changes';
import { PluginCommand } from 'src/view/actions/keyboard-shortcuts/helpers/commands/command-names';
import Lineage from 'src/main';
import {
    isActive,
    isActiveAndNotEditing,
    isEditing,
} from 'src/view/actions/keyboard-shortcuts/helpers/commands/commands/helpers/is-editing';

export const editCommands = (plugin: Lineage) => {
    return [
        {
            name: 'enable_edit_mode',
            check: isActiveAndNotEditing,
            callback: (store, event) => {
                event.preventDefault();
                store.dispatch({
                    type: 'DOCUMENT/ENABLE_EDIT_MODE',
                });
            },
            hotkeys: [{ key: 'Enter', modifiers: [] }],
        },
        {
            name: 'save_changes_and_exit_card',
            check: isActive,
            callback: (store) => {
                if (isEditing(store)) {
                    const view = getActiveLineageView(plugin);
                    saveNodeContent(view);
                }
            },
            hotkeys: [{ key: 'Enter', modifiers: ['Shift', 'Ctrl'] }],
        },

        {
            name: 'disable_edit_mode',
            check: isActive,
            callback: (store) => {
                cancelChanges(store);
            },
            hotkeys: [{ key: 'Escape', modifiers: [] }],
        },
    ] satisfies PluginCommand[];
};
