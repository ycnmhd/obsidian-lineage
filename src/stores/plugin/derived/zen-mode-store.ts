import { LineageView } from 'src/view/view';
import { derived } from 'src/lib/store/derived';

/**
 * Global zen mode flag, shared across every Lineage view. When `true`, all
 * Lineage views hide their own chrome and Obsidian's native workspace chrome
 * is hidden (via a body class managed by the plugin). Stays on until toggled
 * off again.
 */
export const ZenModeStore = (view: LineageView) =>
    derived(view.plugin.store, (state) => state.zenMode);