import { Hotkey } from 'obsidian';
import { DocumentStore } from 'src/view/view';
import { fileHistoryStore } from 'src/stores/file-history/file-history-store';
import Lineage from 'src/main';
import { addNodeAndSplitAtCursor } from 'src/view/actions/keyboard-shortcuts/helpers/add-node-and-split-at-cursor';

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
};

export type PluginCommand = {
    check: (store: DocumentStore) => boolean;
    callback: (store: DocumentStore, event: KeyboardEvent) => void;
    hotkeys: Hotkey[];
};

export const createCommands = (plugin: Lineage) => {
    const isEditing = (store: DocumentStore) => {
        return !!store.getValue().state.editing.activeNodeId;
    };
    const isActive = (store: DocumentStore) => {
        return !!store.getValue().state.activeBranch.node;
    };

    const isActiveAndNotEditing = (store: DocumentStore) => {
        return isActive(store) && !isEditing(store);
    };
    const isActiveAndHasFile = (store: DocumentStore) => {
        return isActive(store) && !!store.getValue().file.path;
    };
    return {
        enable_edit_mode: {
            check: isActiveAndNotEditing,
            callback: (store, event) => {
                event.preventDefault();
                store.dispatch({
                    type: 'ENABLE_EDIT_MODE',
                });
            },
            hotkeys: [{ key: 'Enter', modifiers: [] }],
        },
        save_changes_and_exit_card: {
            check: isActive,
            callback: (store) => {
                if (isEditing(store))
                    store.dispatch({
                        type: 'DISABLE_EDIT_MODE',
                        payload: {
                            save: true,
                        },
                    });
            },
            hotkeys: [{ key: 'Enter', modifiers: ['Alt', 'Ctrl'] }],
        },

        disable_edit_mode: {
            check: isActive,
            callback: (store) => {
                store.dispatch({
                    type: 'DISABLE_EDIT_MODE',
                    payload: {
                        save: false,
                    },
                });
            },
            hotkeys: [{ key: 'Escape', modifiers: [] }],
        },
        add_above: {
            check: isActiveAndNotEditing,
            callback: (store) => {
                store.dispatch({
                    type: 'CREATE_NODE',
                    payload: {
                        position: 'up',
                    },
                });
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
                store.dispatch({
                    type: 'CREATE_NODE',
                    payload: {
                        position: 'down',
                    },
                });
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
                store.dispatch({
                    type: 'CREATE_NODE',
                    payload: {
                        position: 'right',
                    },
                });
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
                store.dispatch({ type: 'TREE/DELETE_NODE' });
            },
            hotkeys: [{ key: 'Backspace', modifiers: ['Ctrl'] }],
        },
        go_right: {
            check: isActiveAndNotEditing,
            callback: (store) => {
                store.dispatch({
                    type: 'CHANGE_ACTIVE_NODE',
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
                    type: 'CHANGE_ACTIVE_NODE',
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
                    type: 'CHANGE_ACTIVE_NODE',
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
                    type: 'CHANGE_ACTIVE_NODE',
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
                    fileHistoryStore.dispatch({
                        type: 'UNDO_REDO_SNAPSHOT',
                        payload: {
                            direction: 'back',
                            path,
                        },
                    });
            },
            hotkeys: [{ key: 'Z', modifiers: ['Ctrl', 'Shift'] }],
        },
        redo_change: {
            check: isActiveAndHasFile,
            callback: (store) => {
                const path = store.getValue().file.path;
                if (path)
                    fileHistoryStore.dispatch({
                        type: 'UNDO_REDO_SNAPSHOT',
                        payload: {
                            direction: 'forward',
                            path,
                        },
                    });
            },
            hotkeys: [{ key: 'Y', modifiers: ['Ctrl', 'Shift'] }],
        },
        move_node_up: {
            check: isActive,
            callback: (store) => {
                store.dispatch({
                    type: 'MOVE_NODE',
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
                    type: 'MOVE_NODE',
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
                    type: 'MOVE_NODE',
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
                    type: 'MOVE_NODE',
                    payload: { direction: 'left' },
                });
            },
            hotkeys: [
                { key: 'h', modifiers: ['Alt', 'Shift'] },
                { key: 'ArrowLeft', modifiers: ['Alt', 'Shift'] },
            ],
        },
    } satisfies Record<keyof typeof hotkeysLang, PluginCommand>;
};
