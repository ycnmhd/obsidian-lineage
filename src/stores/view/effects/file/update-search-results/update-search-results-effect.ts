import { ViewStore } from 'src/view/view';
import { updateSearchResults } from 'src/stores/view/effects/file/update-search-results/helpers/update-search-results';

export const updateSearchResultsEffect = (store: ViewStore) => {
    return store.subscribe((state, action) => {
        if (action) {
            updateSearchResults(store, action);
        }
    });
};
