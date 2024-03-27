import { mergeNode } from 'src/view/actions/keyboard-shortcuts/helpers/commands/commands/helpers/merge-node';
import { PluginCommand } from 'src/view/actions/keyboard-shortcuts/helpers/commands/command-names';
import { isActive } from 'src/view/actions/keyboard-shortcuts/helpers/commands/commands/helpers/is-editing';

export const mergeCommands = () => {
    return [
        {
            name: 'merge_with_node_above',
            check: isActive,
            callback: (view) => {
                mergeNode(view, 'up');
            },
            hotkeys: [
                { key: 'K', modifiers: ['Ctrl', 'Shift'] },
                { key: 'ArrowUp', modifiers: ['Ctrl', 'Shift'] },
            ],
        },
        {
            name: 'merge_with_node_below',
            check: isActive,
            callback: (view) => {
                mergeNode(view, 'down');
            },
            hotkeys: [
                { key: 'J', modifiers: ['Ctrl', 'Shift'] },
                { key: 'ArrowDown', modifiers: ['Ctrl', 'Shift'] },
            ],
        },
    ] as PluginCommand[];
};
