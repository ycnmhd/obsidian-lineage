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
};
export type PluginCommand = {
    check: (store: ViewStore) => boolean;
    callback: (store: ViewStore, event: KeyboardEvent) => void;
    hotkeys: Hotkey[];
    name: CommandName;
};
export type CommandName = keyof typeof hotkeysLang;
