import { ViewState } from 'src/stores/view/view-state-type';

export type SetSearchQueryAction = {
    type: 'SEARCH/SET_QUERY';
    payload: {
        query: string;
    };
};

export const setSearchQuery = (state: ViewState, query: string) => {
    state.search.query = query;
    state.search.results = new Set();
    state.search.searching = query.length > 0;
};
