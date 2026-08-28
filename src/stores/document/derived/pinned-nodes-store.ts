import { LineageView } from 'src/view/view';
import { derived } from 'src/lib/store/derived';

export const PinnedNodesStore = (view: LineageView) => {
    return derived(view.documentStore, (state) => {
        return state.pinnedNodes.Ids;
    });
};

export const PinnedNodesFullStore = (view: LineageView) => {
    return derived(view.documentStore, (state) => {
        return {
            Ids: state.pinnedNodes.Ids,
            nodeToCategory: state.pinnedNodes.nodeToCategory,
            fileCategories: state.pinnedNodes.fileCategories,
        };
    });
};
