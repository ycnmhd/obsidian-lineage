import Lineage from 'src/main';
import { App, Hotkey } from 'obsidian';
import { hotkeyToString } from 'src/view/actions/keyboard-shortcuts/helpers/keyboard-events/hotkey-to-string';

export type HotkeyDictionary = {
    [commandId: string]: Hotkey[];
};

type ExtendedApp = App & {
    hotkeyManager: {
        defaultKeys: HotkeyDictionary;
        customKeys: HotkeyDictionary;
    };
};

const reverseDictionary = (dictionary: HotkeyDictionary) => {
    const entries = Object.entries(dictionary)
        .map(([command, hotkeys]) => {
            return hotkeys.map((hk) => [hotkeyToString(hk), command]);
        })
        .filter((x) => x)
        .flat() as [string, string][];
    return Object.fromEntries(entries);
};

export const getUsedHotkeys = (plugin: Lineage) => {
    const hotkeyManager = (plugin.app as ExtendedApp).hotkeyManager;
    return {
        ...reverseDictionary(hotkeyManager.defaultKeys),
        ...reverseDictionary(hotkeyManager.customKeys),
    };
};
