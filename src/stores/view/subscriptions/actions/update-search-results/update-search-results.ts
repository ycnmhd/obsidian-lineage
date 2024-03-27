import { DocumentStore, ViewStore } from 'src/view/view';
import { performSearch } from 'src/stores/view/subscriptions/actions/update-search-results/helpers/perform-search';

export const updateSearchResults = (
    documentStore: DocumentStore,
    viewStore: ViewStore,
) => {
    {
        const viewState = viewStore.getValue();

        const query = viewState.search.query;
        if (query) {
            const results = performSearch(documentStore, query);
            viewStore.dispatch({
                type: 'SEARCH/SET_RESULTS',
                payload: {
                    results: results.map((r) => r.item.id),
                },
            });

            const shouldUpdateActiveNode =
                results.length > 0 &&
                !results.find(
                    (r) =>
                        r.item.id === viewStore.getValue().document.activeNode,
                );
            if (shouldUpdateActiveNode) {
                viewStore.dispatch({
                    type: 'DOCUMENT/SET_ACTIVE_NODE',
                    payload: {
                        id: results[0].item.id,
                    },
                });
            }
        }
    }
};
