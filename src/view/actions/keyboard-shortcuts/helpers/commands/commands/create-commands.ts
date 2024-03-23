import { saveNodeAndInsertNode } from 'src/view/actions/keyboard-shortcuts/helpers/commands/commands/helpers/save-node-and-insert-node';
import { addNodeAndSplitAtCursor } from 'src/view/actions/keyboard-shortcuts/helpers/commands/commands/helpers/add-node-and-split-at-cursor';
import { PluginCommand } from 'src/view/actions/keyboard-shortcuts/helpers/commands/command-names';
import {
    isActive,
    isEditing,
} from 'src/view/actions/keyboard-shortcuts/helpers/commands/commands/helpers/is-editing';

export const createCommands = () => {
    return [
        {
            name: 'add_above',
            check: isActive,
            callback: (view) => {
                saveNodeAndInsertNode(view, 'up');
            },
            hotkeys: [
                {
                    key: 'ArrowUp',
                    modifiers: ['Ctrl'],
                },
            ],
        },

        {
            name: 'add_below',
            check: isActive,
            callback: (view) => {
                saveNodeAndInsertNode(view, 'down');
            },
            hotkeys: [
                {
                    key: 'ArrowDown',
                    modifiers: ['Ctrl'],
                },
            ],
        },
        {
            name: 'add_child',
            check: isActive,
            callback: (view) => {
                saveNodeAndInsertNode(view, 'right');
            },
            hotkeys: [
                {
                    key: 'ArrowRight',
                    modifiers: ['Ctrl'],
                },
            ],
        },
        {
            name: 'add_above_and_split',
            check: isActive,
            callback: (view) => {
                if (isEditing(view)) addNodeAndSplitAtCursor(view, 'up');
                else saveNodeAndInsertNode(view, 'up');
            },
            hotkeys: [{ key: 'K', modifiers: ['Ctrl'] }],
        },
        {
            name: 'add_below_and_split',
            check: isActive,
            callback: (view) => {
                if (isEditing(view)) addNodeAndSplitAtCursor(view, 'down');
                else saveNodeAndInsertNode(view, 'down');
            },
            hotkeys: [{ key: 'J', modifiers: ['Ctrl'] }],
        },
        {
            name: 'add_child_and_split',
            check: isActive,
            callback: (view) => {
                if (isEditing(view)) addNodeAndSplitAtCursor(view, 'right');
                else saveNodeAndInsertNode(view, 'right');
            },
            hotkeys: [{ key: 'L', modifiers: ['Ctrl'] }],
        },
    ] satisfies PluginCommand[];
};
