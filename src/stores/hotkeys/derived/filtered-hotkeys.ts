import { derived } from 'src/helpers/derived';
import { hotkeyStore } from 'src/stores/hotkeys/hotkey-store';
import { hotkeysLang } from 'src/view/actions/keyboard-shortcuts/helpers/commands/command-names';

export const filteredHotkeys = derived(
    hotkeyStore,
    (store) => {
        if (store.searchTerm) {
            return store.hotkeys.filter((c) => {
                const fullName = hotkeysLang[c.name].toLowerCase();
                return fullName.includes(store.searchTerm);
            });
        } else return store.hotkeys;
    },
    ['UI/SET_SEARCH_TERM', 'SET_CONFLICTING_HOTKEYS'],
);
