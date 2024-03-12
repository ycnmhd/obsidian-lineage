import { moveNode } from 'src/view/actions/keyboard-shortcuts/helpers/commands/commands/helpers/move-node';
import Lineage from 'src/main';
import { PluginCommand } from 'src/view/actions/keyboard-shortcuts/helpers/commands/command-names';
import { isActive } from 'src/view/actions/keyboard-shortcuts/helpers/commands/commands/helpers/is-editing';

export const moveCommands = (plugin: Lineage) => {
    return [
        {
            name: 'move_node_up',
            check: isActive,
            callback: () => {
                moveNode(plugin, 'up');
            },
            hotkeys: [
                { key: 'K', modifiers: ['Alt', 'Shift'] },
                { key: 'ArrowUp', modifiers: ['Alt', 'Shift'] },
            ],
        },
        {
            name: 'move_node_down',
            check: isActive,
            callback: () => {
                moveNode(plugin, 'down');
            },
            hotkeys: [
                { key: 'J', modifiers: ['Alt', 'Shift'] },
                { key: 'ArrowDown', modifiers: ['Alt', 'Shift'] },
            ],
        },
        {
            name: 'move_node_right',
            check: isActive,
            callback: () => {
                moveNode(plugin, 'right');
            },
            hotkeys: [
                { key: 'L', modifiers: ['Alt', 'Shift'] },
                { key: 'ArrowRight', modifiers: ['Alt', 'Shift'] },
            ],
        },
        {
            name: 'move_node_left',
            check: isActive,
            callback: () => {
                moveNode(plugin, 'left');
            },
            hotkeys: [
                { key: 'H', modifiers: ['Alt', 'Shift'] },
                { key: 'ArrowLeft', modifiers: ['Alt', 'Shift'] },
            ],
        },
    ] satisfies PluginCommand[];
};
