import { LineageView } from 'src/view/view';
import { derived } from 'src/lib/store/derived';

export const uiControlsStore = (view: LineageView) =>
    derived(view.viewStore, (state) => state.ui.controls);
