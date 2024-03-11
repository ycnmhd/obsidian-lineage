import { ViewStore } from 'src/view/view';
import Lineage from 'src/main';
import { addNodeAndSplitAtCursor } from 'src/view/actions/keyboard-shortcuts/helpers/tree/add-node-and-split-at-cursor';
import { saveNodeContent } from 'src/view/actions/keyboard-shortcuts/helpers/tree/save-node-content';
import { cancelChanges } from 'src/view/actions/keyboard-shortcuts/helpers/tree/cancel-changes';
import { saveNodeAndInsertNode } from 'src/view/actions/keyboard-shortcuts/helpers/tree/save-node-and-insert-node';
import { mergeNode } from 'src/view/actions/keyboard-shortcuts/helpers/tree/merge-node';
import { PluginCommand } from 'src/view/actions/keyboard-shortcuts/helpers/commands/command-names';
import { hotkeyStore } from 'src/stores/hotkeys/hotkey-store';
import { moveNode } from 'src/view/actions/keyboard-shortcuts/helpers/tree/move-node';

export const pluginCommands: {
    current: PluginCommand[] | null;
} = {
    current: null,
};

export const loadCommands = (plugin: Lineage) => {
    const isEditing = (store: ViewStore) => {
        return !!store.getValue().ui.state.editing.activeNodeId;
    };
    const isActive = (store: ViewStore) => {
        return !!store.getValue().document.state.activeNode;
    };

    const isActiveAndNotEditing = (store: ViewStore) => {
        return isActive(store) && !isEditing(store);
    };
    const isActiveAndHasFile = (store: ViewStore) => {
        return isActive(store) && !!store.getValue().file.path;
    };
    pluginCommands.current = [
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
                if (isEditing(store)) saveNodeContent(store);
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
        {
            name: 'add_above',
            check: isActiveAndNotEditing,
            callback: (store) => {
                saveNodeAndInsertNode(store, 'up');
            },
            hotkeys: [
                {
                    key: 'ArrowUp',
                    modifiers: ['Ctrl'],
                },
            ],
        },
        {
            name: 'add_above_and_split',
            check: isActive,
            callback: (store) => {
                addNodeAndSplitAtCursor(store, plugin, 'up');
            },
            hotkeys: [{ key: 'K', modifiers: ['Ctrl'] }],
        },
        {
            name: 'add_below',
            check: isActiveAndNotEditing,
            callback: (store) => {
                saveNodeAndInsertNode(store, 'down');
            },
            hotkeys: [
                {
                    key: 'ArrowDown',
                    modifiers: ['Ctrl'],
                },
            ],
        },
        {
            name: 'add_below_and_split',
            check: isActive,
            callback: (store) => {
                addNodeAndSplitAtCursor(store, plugin, 'down');
            },
            hotkeys: [{ key: 'J', modifiers: ['Ctrl'] }],
        },
        {
            name: 'add_child',
            check: isActiveAndNotEditing,
            callback: (store) => {
                saveNodeAndInsertNode(store, 'right');
            },
            hotkeys: [
                {
                    key: 'ArrowRight',
                    modifiers: ['Ctrl'],
                },
            ],
        },
        {
            name: 'add_child_and_split',
            check: isActive,
            callback: (store) => {
                addNodeAndSplitAtCursor(store, plugin, 'right');
            },
            hotkeys: [{ key: 'L', modifiers: ['Ctrl'] }],
        },
        {
            name: 'delete_card',
            check: isActive,
            callback: (store) => {
                store.dispatch({ type: 'DOCUMENT/DELETE_NODE' });
            },
            hotkeys: [{ key: 'Backspace', modifiers: ['Ctrl'] }],
        },
        {
            name: 'go_right',
            check: isActiveAndNotEditing,
            callback: (store) => {
                store.dispatch({
                    type: 'DOCUMENT/NAVIGATE_USING_KEYBOARD',
                    payload: {
                        direction: 'right',
                    },
                });
            },
            hotkeys: [
                { key: 'L', modifiers: [] },
                { key: 'ArrowRight', modifiers: [] },
            ],
        },
        {
            name: 'go_down',
            check: isActiveAndNotEditing,
            callback: (store) => {
                store.dispatch({
                    type: 'DOCUMENT/NAVIGATE_USING_KEYBOARD',
                    payload: {
                        direction: 'down',
                    },
                });
            },
            hotkeys: [
                { key: 'J', modifiers: [] },
                { key: 'ArrowDown', modifiers: [] },
            ],
        },
        {
            name: 'go_left',
            check: isActiveAndNotEditing,
            callback: (store) => {
                store.dispatch({
                    type: 'DOCUMENT/NAVIGATE_USING_KEYBOARD',
                    payload: {
                        direction: 'left',
                    },
                });
            },
            hotkeys: [
                { key: 'H', modifiers: [] },
                { key: 'ArrowLeft', modifiers: [] },
            ],
        },
        {
            name: 'go_up',
            check: isActiveAndNotEditing,
            callback: (store) => {
                store.dispatch({
                    type: 'DOCUMENT/NAVIGATE_USING_KEYBOARD',
                    payload: {
                        direction: 'up',
                    },
                });
            },
            hotkeys: [
                { key: 'K', modifiers: [] },
                { key: 'ArrowUp', modifiers: [] },
            ],
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
            name: 'move_node_up',
            check: isActive,
            callback: (store) => {
                moveNode(store, 'up');
            },
            hotkeys: [
                { key: 'K', modifiers: ['Alt', 'Shift'] },
                { key: 'ArrowUp', modifiers: ['Alt', 'Shift'] },
            ],
        },
        {
            name: 'move_node_down',
            check: isActive,
            callback: (store) => {
                moveNode(store, 'down');
            },
            hotkeys: [
                { key: 'J', modifiers: ['Alt', 'Shift'] },
                { key: 'ArrowDown', modifiers: ['Alt', 'Shift'] },
            ],
        },
        {
            name: 'move_node_right',
            check: isActive,
            callback: (store) => {
                moveNode(store, 'right');
            },
            hotkeys: [
                { key: 'L', modifiers: ['Alt', 'Shift'] },
                { key: 'ArrowRight', modifiers: ['Alt', 'Shift'] },
            ],
        },
        {
            name: 'move_node_left',
            check: isActive,
            callback: (store) => {
                moveNode(store, 'left');
            },
            hotkeys: [
                { key: 'H', modifiers: ['Alt', 'Shift'] },
                { key: 'ArrowLeft', modifiers: ['Alt', 'Shift'] },
            ],
        },
        {
            name: 'merge_with_node_above',
            check: isActive,
            callback: (store) => {
                mergeNode(store, 'up');
            },
            hotkeys: [
                { key: 'K', modifiers: ['Ctrl', 'Shift'] },
                { key: 'ArrowUp', modifiers: ['Ctrl', 'Shift'] },
            ],
        },
        {
            name: 'merge_with_node_below',
            check: isActive,
            callback: (store) => {
                mergeNode(store, 'down');
            },
            hotkeys: [
                { key: 'J', modifiers: ['Ctrl', 'Shift'] },
                { key: 'ArrowDown', modifiers: ['Ctrl', 'Shift'] },
            ],
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
        {
            name: 'go_to_beginning_of_group',
            check: isActive,
            callback: (store, e) => {
                e.preventDefault();
                e.stopPropagation();
                store.dispatch({
                    type: 'DOCUMENT/JUMP_TO_NODE',
                    payload: { target: 'start-of-group' },
                });
            },
            hotkeys: [{ key: 'PageUp', modifiers: [] }],
        },
        {
            name: 'go_to_end_of_group',
            check: isActive,
            callback: (store, e) => {
                e.preventDefault();
                e.stopPropagation();
                store.dispatch({
                    type: 'DOCUMENT/JUMP_TO_NODE',
                    payload: { target: 'end-of-group' },
                });
            },
            hotkeys: [{ key: 'PageDown', modifiers: [] }],
        },
        {
            name: 'go_to_beginning_of_column',
            check: isActive,
            callback: (store, e) => {
                e.preventDefault();
                e.stopPropagation();
                store.dispatch({
                    type: 'DOCUMENT/JUMP_TO_NODE',
                    payload: { target: 'start-of-column' },
                });
            },
            hotkeys: [{ key: 'Home', modifiers: [] }],
        },
        {
            name: 'go_to_end_of_column',
            check: isActive,
            callback: (store, e) => {
                e.preventDefault();
                e.stopPropagation();
                store.dispatch({
                    type: 'DOCUMENT/JUMP_TO_NODE',
                    payload: { target: 'end-of-column' },
                });
            },
            hotkeys: [{ key: 'End', modifiers: [] }],
        },
    ];
    hotkeyStore.dispatch({
        type: 'SETTINGS/LOAD_CUSTOM_HOTKEYS',
        payload: {
            customHotkeys: plugin.settings.getValue().hotkeys.customHotkeys,
        },
    });
};
