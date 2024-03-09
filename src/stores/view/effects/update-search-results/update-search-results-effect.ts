import { ViewStore } from 'src/view/view';
import { debounce } from 'obsidian';
import { updateSearchResults } from 'src/stores/view/effects/update-search-results';

const debouncedSearch = debounce(updateSearchResults, 1000);

export const updateSearchResultsEffect = (store: ViewStore) => {
    return store.subscribe((state, action) => {
        if (action) {
            debouncedSearch(store, action);
        }
    });
};
