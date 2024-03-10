import { ViewStore } from 'src/view/view';
import { Hotkey } from 'obsidian';

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
    toggle_search_input: 'Search',
    go_to_beginning_of_group: 'Go to beginning of group',
    go_to_end_of_group: 'Go to end of group',
    go_to_beginning_of_column: 'Go to beginning of column',
    go_to_end_of_column: 'Go to end of column',
};
export type PluginCommand = {
    check: (store: ViewStore) => boolean;
    callback: (store: ViewStore, event: KeyboardEvent) => void;
    hotkeys: Hotkey[];
    name: CommandName;
};
export type CommandName = keyof typeof hotkeysLang;
export type GroupName = keyof typeof groupedHotkeys;
export const groupedHotkeys = {
    'Create cards': new Set([
        'add_child',
        'add_below',
        'add_above',
        'add_child_and_split',
        'add_below_and_split',
        'add_above_and_split',
    ]),
    'Edit cards': new Set([
        'enable_edit_mode',
        'disable_edit_mode',
        'save_changes_and_exit_card',
    ]),
    'Move cards': new Set([
        'move_node_up',
        'move_node_down',
        'move_node_right',
        'move_node_left',
    ]),
    'Merge cards': new Set(['merge_with_node_above', 'merge_with_node_below']),
    'Delete cards': new Set(['delete_card']),
    Navigation: new Set([
        'go_up',
        'go_down',
        'go_right',
        'go_left',
        'go_to_beginning_of_group',
        'go_to_end_of_group',
        'go_to_beginning_of_column',
        'go_to_end_of_column',
    ]),
    history: new Set(['undo_change', 'redo_change']),
    search: new Set(['toggle_search_input']),
} satisfies Record<string, Set<CommandName>>;

export const hotkeysGroups: Record<CommandName, GroupName> = Object.fromEntries(
    Object.entries(groupedHotkeys)
        .map(([group, commands]) => Array.from(commands).map((c) => [c, group]))
        .flat(),
);
console.log(hotkeysGroups);
