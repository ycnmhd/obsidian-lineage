import { Hotkey } from 'obsidian';
import { ViewStore } from 'src/view/view';
import Lineage from 'src/main';
import { addNodeAndSplitAtCursor } from 'src/view/actions/keyboard-shortcuts/helpers/add-node-and-split-at-cursor';
import { saveNodeContent } from 'src/view/actions/keyboard-shortcuts/helpers/save-node-content';
import { cancelChanges } from 'src/view/actions/keyboard-shortcuts/helpers/cancel-changes';
import { saveNodeAndInsertNode } from 'src/view/actions/keyboard-shortcuts/helpers/save-node-and-insert-node';
import { mergeNode } from 'src/view/actions/keyboard-shortcuts/helpers/merge-node';

export const hotkeysLang = {
    save_changes_and_exit_card: 'Save changes and exit card',
    // toggle_edit_mode: 'Toggle edit',
    enable_edit_mode: 'Edit card',
    disable_edit_mode: 'Cancel changes',
    add_child: 'Add child',
    add_below: 'Add card below',
    add_above: 'Add card above',
    add_child_and_split: 'Add child and split at cursor',
    add_below_and_split: 'Add card below and split at cursor',
    add_above_and_split: 'Add card above and split at cursor',
    delete_card: 'Delete card',
    go_up: 'Go up',
    go_down: 'Go down',
    go_right: 'Go right',
    go_left: 'Go left',
    undo_change: 'Undo change',
    redo_change: 'Redo change',
    move_node_up: 'Move card up',
    move_node_down: 'Move card down',
    move_node_right: 'Move card right',
    move_node_left: 'Move card left',
    merge_with_node_above: 'Merge with card above',
    merge_with_node_below: 'Merge with card below',
};

export type PluginCommand = {
    check: (store: ViewStore) => boolean;
    callback: (store: ViewStore, event: KeyboardEvent) => void;
    hotkeys: Hotkey[];
};

export const createCommands = (plugin: Lineage) => {
    const isEditing = (store: ViewStore) => {
        return !!store.getValue().document.state.editing.activeNodeId;
    };
    const isActive = (store: ViewStore) => {
        return !!store.getValue().document.state.activeBranch.node;
    };

    const isActiveAndNotEditing = (store: ViewStore) => {
        return isActive(store) && !isEditing(store);
    };
    const isActiveAndHasFile = (store: ViewStore) => {
        return isActive(store) && !!store.getValue().file.path;
    };
    return {
        enable_edit_mode: {
            check: isActiveAndNotEditing,
            callback: (store, event) => {
                event.preventDefault();
                store.dispatch({
                    type: 'DOCUMENT/ENABLE_EDIT_MODE',
                });
            },
            hotkeys: [{ key: 'Enter', modifiers: [] }],
        },
        save_changes_and_exit_card: {
            check: isActive,
            callback: (store) => {
                if (isEditing(store)) saveNodeContent(store);
            },
            hotkeys: [{ key: 'Enter', modifiers: ['Alt', 'Ctrl'] }],
        },

        disable_edit_mode: {
            check: isActive,
            callback: (store) => {
                cancelChanges(store);
            },
            hotkeys: [{ key: 'Escape', modifiers: [] }],
        },
        add_above: {
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
        add_above_and_split: {
            check: isActive,
            callback: (store) => {
                addNodeAndSplitAtCursor(store, plugin, 'up');
            },
            hotkeys: [{ key: 'k', modifiers: ['Ctrl'] }],
        },
        add_below: {
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
        add_below_and_split: {
            check: isActive,
            callback: (store) => {
                addNodeAndSplitAtCursor(store, plugin, 'down');
            },
            hotkeys: [{ key: 'j', modifiers: ['Ctrl'] }],
        },
        add_child: {
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
        add_child_and_split: {
            check: isActive,
            callback: (store) => {
                addNodeAndSplitAtCursor(store, plugin, 'right');
            },
            hotkeys: [{ key: 'l', modifiers: ['Ctrl'] }],
        },
        delete_card: {
            check: isActive,
            callback: (store) => {
                store.dispatch({ type: 'DOCUMENT/DELETE_NODE' });
            },
            hotkeys: [{ key: 'Backspace', modifiers: ['Ctrl'] }],
        },
        go_right: {
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
                { key: 'l', modifiers: [] },
                { key: 'ArrowRight', modifiers: [] },
            ],
        },
        go_down: {
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
                { key: 'j', modifiers: [] },
                { key: 'ArrowDown', modifiers: [] },
            ],
        },
        go_left: {
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
                { key: 'h', modifiers: [] },
                { key: 'ArrowLeft', modifiers: [] },
            ],
        },
        go_up: {
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
                { key: 'k', modifiers: [] },
                { key: 'ArrowUp', modifiers: [] },
            ],
        },
        undo_change: {
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
        redo_change: {
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
        move_node_up: {
            check: isActive,
            callback: (store) => {
                store.dispatch({
                    type: 'DOCUMENT/MOVE_NODE',
                    payload: { direction: 'up' },
                });
            },
            hotkeys: [
                { key: 'k', modifiers: ['Alt', 'Shift'] },
                { key: 'ArrowUp', modifiers: ['Alt', 'Shift'] },
            ],
        },
        move_node_down: {
            check: isActive,
            callback: (store) => {
                store.dispatch({
                    type: 'DOCUMENT/MOVE_NODE',
                    payload: { direction: 'down' },
                });
            },
            hotkeys: [
                { key: 'j', modifiers: ['Alt', 'Shift'] },
                { key: 'ArrowDown', modifiers: ['Alt', 'Shift'] },
            ],
        },
        move_node_right: {
            check: isActive,
            callback: (store) => {
                store.dispatch({
                    type: 'DOCUMENT/MOVE_NODE',
                    payload: { direction: 'right' },
                });
            },
            hotkeys: [
                { key: 'l', modifiers: ['Alt', 'Shift'] },
                { key: 'ArrowRight', modifiers: ['Alt', 'Shift'] },
            ],
        },
        move_node_left: {
            check: isActive,
            callback: (store) => {
                store.dispatch({
                    type: 'DOCUMENT/MOVE_NODE',
                    payload: { direction: 'left' },
                });
            },
            hotkeys: [
                { key: 'h', modifiers: ['Alt', 'Shift'] },
                { key: 'ArrowLeft', modifiers: ['Alt', 'Shift'] },
            ],
        },
        merge_with_node_above: {
            check: isActive,
            callback: (store) => {
                mergeNode(store, 'up');
            },
            hotkeys: [
                { key: 'k', modifiers: ['Ctrl', 'Shift'] },
                { key: 'ArrowUp', modifiers: ['Ctrl', 'Shift'] },
            ],
        },
        merge_with_node_below: {
            check: isActive,
            callback: (store) => {
                mergeNode(store, 'down');
            },
            hotkeys: [
                { key: 'j', modifiers: ['Ctrl', 'Shift'] },
                { key: 'ArrowDown', modifiers: ['Ctrl', 'Shift'] },
            ],
        },
    } satisfies Record<keyof typeof hotkeysLang, PluginCommand>;
};
