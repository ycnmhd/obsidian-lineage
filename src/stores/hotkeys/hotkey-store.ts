import { Store } from 'src/lib/store/store';
import {
    CommandName,
    GroupName,
} from 'src/view/actions/keyboard-shortcuts/helpers/commands/command-names';
import { HotkeyAction, hotkeyReducer } from 'src/stores/hotkeys/hotkey-reducer';
import { CustomHotkeys } from 'src/stores/settings/settings-type';
import { Hotkey } from 'obsidian';

export type ExtendedHotkey = Hotkey & {
    string_representation: string;
    obsidianConflict?: string;
    pluginConflict?: string;
    isCustom?: boolean;
};
export type CommandHotkeys = {
    name: CommandName;
    hotkeys: ExtendedHotkey[];
    group: GroupName;
};

export type HotkeyState = {
    hotkeys: CommandHotkeys[];
    searchTerm: string;
    customHotkeys: CustomHotkeys;
    numberOfConflictingHotkeys: number;
};

const initialValue: HotkeyState = {
    hotkeys: [],
    searchTerm: '',
    customHotkeys: {},
    numberOfConflictingHotkeys: 0,
};

export const hotkeyStore = new Store<HotkeyState, HotkeyAction>(
    initialValue,
    hotkeyReducer,
);
