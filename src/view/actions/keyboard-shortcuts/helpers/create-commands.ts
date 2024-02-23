import { Hotkey, Notice } from 'obsidian';
import { DocumentStore } from 'src/view/view';

const lang = {
    save_changes_and_exit_card: 'Save changes and exit card',
    // toggle_edit_mode: 'Toggle edit',
    enable_edit_mode: 'Edit card',
    disable_edit_mode: 'Cancel changes',
    add_child: 'Add child',
    add_below: 'Add below',
    add_above: 'Add above',
    delete_card: 'Delete card',
    go_up: 'Go up',
    go_down: 'Go down',
    go_right: 'Go right',
    go_left: 'Go left',
};

export type PluginCommand = {
    check: (store: DocumentStore) => boolean;
    callback: (store: DocumentStore) => void;
    hotkeys: Hotkey[];
};

export const createCommands = () => {
    const isEditing = (store: DocumentStore) => {
        return !!store.getValue().state.editing.activeNodeId;
    };
    const isActive = (store: DocumentStore) => {
        return !!store.getValue().state.activeBranch.node;
    };

    const isActiveAndNotEditing = (store: DocumentStore) => {
        return isActive(store) && !isEditing(store);
    };
    return {
        enable_edit_mode: {
            check: isActive,
            callback: (store) => {
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
            check: isActive,
            callback: (store) => {
                store.dispatch({
                    type: 'CREATE_NODE',
                    payload: {
                        position: 'top',
                    },
                });
            },
            hotkeys: [
                { key: 'k', modifiers: ['Ctrl'] },
                {
                    key: 'ArrowUp',
                    modifiers: ['Ctrl'],
                },
            ],
        },
        add_below: {
            check: isActive,
            callback: (store) => {
                store.dispatch({
                    type: 'CREATE_NODE',
                    payload: {
                        position: 'bottom',
                    },
                });
            },
            hotkeys: [
                { key: 'j', modifiers: ['Ctrl'] },
                {
                    key: 'ArrowDown',
                    modifiers: ['Ctrl'],
                },
            ],
        },
        add_child: {
            check: isActive,
            callback: (store) => {
                store.dispatch({
                    type: 'CREATE_NODE',
                    payload: {
                        position: 'right',
                    },
                });
            },
            hotkeys: [
                { key: 'l', modifiers: ['Ctrl'] },
                {
                    key: 'ArrowRight',
                    modifiers: ['Ctrl'],
                },
            ],
        },

        delete_card: {
            check: isActive,
            callback: () => {
                new Notice('not implemented');
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
                        direction: 'bottom',
                    },
                });
            },
            hotkeys: [
                { key: 'k', modifiers: [] },
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
                        direction: 'top',
                    },
                });
            },
            hotkeys: [
                { key: 'j', modifiers: [] },
                { key: 'ArrowUp', modifiers: [] },
            ],
        },
    } satisfies Record<keyof typeof lang, PluginCommand>;
};
