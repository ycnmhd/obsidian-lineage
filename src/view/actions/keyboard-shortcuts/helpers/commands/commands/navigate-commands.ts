import { PluginCommand } from 'src/view/actions/keyboard-shortcuts/helpers/commands/command-names';
import { isActiveAndNotEditing } from 'src/view/actions/keyboard-shortcuts/helpers/commands/commands/helpers/is-editing';

export const navigateCommands = () => {
    const commands: PluginCommand[] = [];
    commands.push(
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
            name: 'go_to_beginning_of_group',
            check: isActiveAndNotEditing,
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
            check: isActiveAndNotEditing,
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
            check: isActiveAndNotEditing,
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
            check: isActiveAndNotEditing,
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
    );
    return commands;
};
