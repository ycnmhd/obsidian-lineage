import { LineageView } from 'src/view/view';
import { derived } from 'src/lib/store/derived';

export const activeNodeStore = (view: LineageView) =>
    derived(view.viewStore, (state) => state.document.activeNode);
