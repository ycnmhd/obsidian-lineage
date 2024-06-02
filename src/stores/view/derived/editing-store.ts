import { LineageView } from 'src/view/view';
import { derived } from 'src/lib/store/derived';

export const documentStateStore = (view: LineageView) =>
    derived(view.viewStore, (state) => state.document.editing);
