import { LineageView } from 'src/view/view';
import { derived } from 'src/lib/store/derived';

export const idSectionStore = (view: LineageView) => {
    return derived(view.documentStore, (state) => {
        return state.sections.id_section;
    });
};
