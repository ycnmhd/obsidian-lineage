import { Store } from 'src/helpers/store/store';
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
};

const initialValue: HotkeyState = {
    hotkeys: [],
    searchTerm: '',
    customHotkeys: {},
};

export const hotkeyStore = new Store<HotkeyState, HotkeyAction>(
    initialValue,
    hotkeyReducer,
);
