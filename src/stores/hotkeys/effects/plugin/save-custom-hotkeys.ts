import Lineage from 'src/main';
import { hotkeyStore } from 'src/stores/hotkeys/hotkey-store';

export const saveCustomHotkeys = (plugin: Lineage) => {
    hotkeyStore.subscribe((state, action) => {
        if (
            action?.type === 'HOTKEY/RESET' ||
            action?.type === 'HOTKEY/UPDATE'
        ) {
            plugin.settings.dispatch({
                type: 'SET_CUSTOM_HOTKEYS',
                payload: {
                    customHotkeys: state.customHotkeys,
                },
            });
        }
    });
};
