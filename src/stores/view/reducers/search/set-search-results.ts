import { NodeId, ViewState } from 'src/stores/view/view-state-type';

export type SetSearchResultsAction = {
    type: 'SEARCH/SET_RESULTS';
    payload: {
        results: NodeId[];
    };
};

export const setSearchResults = (state: ViewState, results: NodeId[]) => {
    state.search.results = new Set(results);
    state.search.searching = false;
};
