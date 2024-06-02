import { LineageView } from 'src/view/view';
import { derived } from 'src/lib/store/derived';

export const scrollingModeStore = (view: LineageView) =>
    derived(
        view.plugin.settings,
        (state) => state.view.scrolling.horizontalScrollingMode,
    );
export const horizontalOffsetStore = (view: LineageView) =>
    derived(
        view.plugin.settings,
        (state) => state.view.scrolling.horizontalOffset,
    );
export const verticalOffsetStore = (view: LineageView) =>
    derived(
        view.plugin.settings,
        (state) => state.view.scrolling.verticalOffset,
    );
