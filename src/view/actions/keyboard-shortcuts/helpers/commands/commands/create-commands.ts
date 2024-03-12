import { saveNodeAndInsertNode } from 'src/view/actions/keyboard-shortcuts/helpers/commands/commands/helpers/save-node-and-insert-node';
import { addNodeAndSplitAtCursor } from 'src/view/actions/keyboard-shortcuts/helpers/commands/commands/helpers/add-node-and-split-at-cursor';
import Lineage from 'src/main';
import { PluginCommand } from 'src/view/actions/keyboard-shortcuts/helpers/commands/command-names';
import {
    isActive,
    isEditing,
} from 'src/view/actions/keyboard-shortcuts/helpers/commands/commands/helpers/is-editing';

export const createCommands = (plugin: Lineage) => {
    return [
        {
            name: 'add_above',
            check: isActive,
            callback: () => {
                saveNodeAndInsertNode(plugin, 'up');
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
            callback: () => {
                saveNodeAndInsertNode(plugin, 'down');
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
            callback: () => {
                saveNodeAndInsertNode(plugin, 'right');
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
            callback: (store) => {
                if (isEditing(store)) addNodeAndSplitAtCursor(plugin, 'up');
                else saveNodeAndInsertNode(plugin, 'up');
            },
            hotkeys: [{ key: 'K', modifiers: ['Ctrl'] }],
        },
        {
            name: 'add_below_and_split',
            check: isActive,
            callback: (store) => {
                if (isEditing(store)) addNodeAndSplitAtCursor(plugin, 'down');
                else saveNodeAndInsertNode(plugin, 'down');
            },
            hotkeys: [{ key: 'J', modifiers: ['Ctrl'] }],
        },
        {
            name: 'add_child_and_split',
            check: isActive,
            callback: (store) => {
                if (isEditing(store)) addNodeAndSplitAtCursor(plugin, 'right');
                else saveNodeAndInsertNode(plugin, 'right');
            },
            hotkeys: [{ key: 'L', modifiers: ['Ctrl'] }],
        },
    ] satisfies PluginCommand[];
};
