import { eventToString } from 'src/view/actions/keyboard-shortcuts/helpers/keyboard-events/event-to-string';
import { PluginCommand } from 'src/view/actions/keyboard-shortcuts/helpers/create-commands';
import { hotkeyToString } from 'src/view/actions/keyboard-shortcuts/helpers/keyboard-events/hotkey-to-string';
import { getUsedHotkeys } from 'src/obsidian/helpers/get-used-hotkeys';
import Lineage from 'src/main';

export const detectConflictingHotkeys = (
    plugin: Lineage,
    commands: PluginCommand[],
    container: HTMLElement,
) => {
    const free = new Set();
    const all = [];
    const listener = (event: KeyboardEvent) => {
        const hotkey = eventToString(event);
        free.add(hotkey);
    };
    const el = document.createElement('div');
    el.addEventListener('keydown', listener);
    container.append(el);

    for (const command of commands) {
        for (const hotkey of command.hotkeys) {
            all.push(hotkeyToString(hotkey));
            const modifiers = new Set(hotkey.modifiers);
            const event = new KeyboardEvent('keydown', {
                key: hotkey.key,
                shiftKey: modifiers.has('Shift'),
                altKey: modifiers.has('Alt'),
                ctrlKey: modifiers.has('Ctrl'),
            });
            el.dispatchEvent(event);
        }
    }
    el.removeEventListener('keydown', listener);
    container.removeChild(el);
    const used = getUsedHotkeys(plugin);
    return new Map(all.filter((h) => !free.has(h)).map((hk) => [hk, used[hk]]));
};
