import { CommandHotkeys, HotkeyState } from 'src/stores/hotkeys/hotkey-store';
import { ConflictingHotkeys } from 'src/obsidian/helpers/get-used-hotkeys';

export type UpdateConflictingHotkeysAction = {
    type: 'SET_CONFLICTING_HOTKEYS';
    payload: {
        conflictingHotkeys: ConflictingHotkeys;
    };
};
export const updateConflictingHotkeys = (
    state: HotkeyState,
    action: UpdateConflictingHotkeysAction,
) => {
    const groupedByHotkey = new Map<string, Set<CommandHotkeys>>();
    for (const pluginHotkey of state.hotkeys) {
        for (const hotkey of pluginHotkey.hotkeys) {
            delete hotkey.obsidianConflict;
            delete hotkey.pluginConflict;

            const conflict = action.payload.conflictingHotkeys.get(
                hotkey.string_representation,
            );
            if (conflict) {
                hotkey.obsidianConflict = conflict;
            } else {
                let set = groupedByHotkey.get(hotkey.string_representation);
                if (!set) {
                    set = new Set();
                    groupedByHotkey.set(hotkey.string_representation, set);
                }
                set.add(pluginHotkey);
            }
        }
    }
    const conflicting = [...groupedByHotkey.entries()].filter(
        (v) => v[1].size > 1,
    );
    for (const [string_representation, hotkeys] of conflicting) {
        const conflicting = Array.from(hotkeys)
            .map((h) => h.name)
            .join(', ');
        for (const pluginHotkey of hotkeys) {
            for (const hotkey of pluginHotkey.hotkeys) {
                if (hotkey.string_representation === string_representation)
                    hotkey.pluginConflict = conflicting;
            }
        }
    }
};
