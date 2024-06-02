import { hotkeyStore } from 'src/stores/hotkeys/hotkey-store';
import { derived } from 'src/lib/store/derived';

export const numberOfConflictingHotkeysStore = () =>
    derived(hotkeyStore, (store) => store.numberOfConflictingHotkeys);
