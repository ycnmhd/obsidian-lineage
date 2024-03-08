import { Hotkey } from 'obsidian';

import { CommandName } from 'src/view/actions/keyboard-shortcuts/helpers/commands/command-names';

export type CustomHotkeys = {
    [command in CommandName]?: {
        primary?: Hotkey;
        secondary?: Hotkey;
    };
};
export type Settings = {
    documents: Record<string, true>;
    ui: {
        theme: 'dark' | 'light';
    };
    hotkeys: {
        customHotkeys: CustomHotkeys;
    };
};
