import { hotkeyStore } from 'src/stores/hotkeys/hotkey-store';
import Lineage from 'src/main';
import { getUsedHotkeys } from 'src/obsidian/helpers/get-used-hotkeys';

export const checkForHotkeyConflicts = (plugin: Lineage) => {
    return hotkeyStore.subscribe((state, action, firstRun) => {
        if (
            firstRun ||
            action?.type === 'HOTKEY/UPDATE' ||
            action?.type === 'HOTKEY/RESET'
        ) {
            const conflictingHotkeys = getUsedHotkeys(plugin);
            hotkeyStore.dispatch({
                type: 'SET_CONFLICTING_HOTKEYS',
                payload: {
                    conflictingHotkeys,
                },
            });
        }
    });
};
