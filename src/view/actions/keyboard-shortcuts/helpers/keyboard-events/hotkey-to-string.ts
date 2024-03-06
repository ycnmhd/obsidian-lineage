import { Hotkey } from 'obsidian';

export const hotkeyToString = (hotkey: Hotkey) =>
    hotkey.key.toUpperCase() +
    hotkey.modifiers
        .sort()
        .map((x) => (x === 'Mod' ? 'Ctrl' : x))
        .join('');
