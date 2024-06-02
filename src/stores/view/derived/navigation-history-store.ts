import { LineageView } from 'src/view/view';
import { derived } from 'src/lib/store/derived';

export const navigationHistoryStore = (view: LineageView) =>
    derived(view.viewStore, (state) => state.navigationHistory);
