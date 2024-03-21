import { DocumentStore } from 'src/view/view';
import { searchState } from 'src/stores/view/subscriptions/actions/update-search-results/helpers/perform-search';

export const resetSearchFuse = (documentStore: DocumentStore) => {
    searchState.fuse.delete(documentStore);
};
