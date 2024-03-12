import { derived } from 'src/helpers/store/derived';
import { CommandHotkeys, hotkeyStore } from 'src/stores/hotkeys/hotkey-store';
import {
    GroupName,
    hotkeysLang,
} from 'src/view/actions/keyboard-shortcuts/helpers/commands/command-names';
import { groupArrayByProperty } from 'src/helpers/group-array-by-property';

type GroupedHotkeys = Record<GroupName, CommandHotkeys[]>;
export const filteredHotkeys = derived(
    hotkeyStore,
    (store) => {
        let array: CommandHotkeys[] = [];
        if (store.searchTerm) {
            array = store.hotkeys.filter((c) => {
                const fullName = hotkeysLang[c.name].toLowerCase();
                return (
                    fullName.includes(store.searchTerm) ||
                    c.group.toLowerCase().includes(store.searchTerm)
                );
            });
        } else array = store.hotkeys;
        return groupArrayByProperty(array, 'group', {
            'Create cards': [],
            'Edit cards': [],
            'Move cards': [],
            'Merge cards': [],
            'Delete cards': [],
            Navigation: [],
            history: [],
            search: [],
        } satisfies GroupedHotkeys);
    },
    ['UI/SET_SEARCH_TERM', 'SET_CONFLICTING_HOTKEYS'],
);
