import { mergeNode } from 'src/view/actions/keyboard-shortcuts/helpers/commands/commands/helpers/merge-node';
import { PluginCommand } from 'src/view/actions/keyboard-shortcuts/helpers/commands/command-names';
import Lineage from 'src/main';
import { isActive } from 'src/view/actions/keyboard-shortcuts/helpers/commands/commands/helpers/is-editing';

export const mergeCommands = (plugin: Lineage) => {
    return [
        {
            name: 'merge_with_node_above',
            check: isActive,
            callback: () => {
                mergeNode(plugin, 'up');
            },
            hotkeys: [
                { key: 'K', modifiers: ['Ctrl', 'Shift'] },
                { key: 'ArrowUp', modifiers: ['Ctrl', 'Shift'] },
            ],
        },
        {
            name: 'merge_with_node_below',
            check: isActive,
            callback: () => {
                mergeNode(plugin, 'down');
            },
            hotkeys: [
                { key: 'J', modifiers: ['Ctrl', 'Shift'] },
                { key: 'ArrowDown', modifiers: ['Ctrl', 'Shift'] },
            ],
        },
    ] as PluginCommand[];
};
