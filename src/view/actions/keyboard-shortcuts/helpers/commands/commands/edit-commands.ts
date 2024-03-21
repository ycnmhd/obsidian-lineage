import { getActiveLineageView } from 'src/view/actions/keyboard-shortcuts/helpers/commands/commands/helpers/get-active-lineage-view';
import { saveNodeContent } from 'src/view/actions/keyboard-shortcuts/helpers/commands/commands/helpers/save-node-content';
import { cancelChanges } from 'src/view/actions/keyboard-shortcuts/helpers/commands/commands/helpers/cancel-changes';
import { PluginCommand } from 'src/view/actions/keyboard-shortcuts/helpers/commands/command-names';
import Lineage from 'src/main';
import {
    isActiveAndEditing,
    isActiveAndNotEditing,
} from 'src/view/actions/keyboard-shortcuts/helpers/commands/commands/helpers/is-editing';

export const editCommands = (plugin: Lineage) => {
    return [
        {
            name: 'enable_edit_mode',
            check: isActiveAndNotEditing,
            callback: (view, event) => {
                event.preventDefault();
                view.viewStore.dispatch({
                    type: 'DOCUMENT/ENABLE_EDIT_MODE',
                    payload: {
                        nodeId: view.viewStore.getValue().document.activeNode,
                    },
                });
            },
            hotkeys: [{ key: 'Enter', modifiers: [] }],
        },
        {
            name: 'save_changes_and_exit_card',
            check: isActiveAndEditing,
            callback: () => {
                const view = getActiveLineageView(plugin);
                saveNodeContent(view);
            },
            hotkeys: [{ key: 'Enter', modifiers: ['Shift', 'Ctrl'] }],
        },

        {
            name: 'disable_edit_mode',
            check: isActiveAndEditing,
            callback: () => {
                cancelChanges(plugin);
            },
            hotkeys: [{ key: 'Escape', modifiers: [] }],
        },
    ] satisfies PluginCommand[];
};
