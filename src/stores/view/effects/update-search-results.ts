import { ViewStore } from 'src/view/view';
import Fuse from 'fuse.js';
import { ViewAction } from 'src/stores/view/view-store-actions';
import { getViewEventType } from 'src/stores/view/helpers/get-view-event-type';

type DocumentFuse = Fuse<{ id: string; content: string }>;
type State = {
    fuse: Map<ViewStore, DocumentFuse>;
};
const searchState: State = {
    fuse: new Map(),
};

export const updateSearchResults = (store: ViewStore, action: ViewAction) => {
    const eventType = getViewEventType(action['type']);
    if (
        eventType.content ||
        eventType.shape ||
        eventType.creationAndDeletion ||
        eventType.changeHistory
    ) {
        searchState.fuse.delete(store);
    }
    if (action.type === 'SEARCH/SET_QUERY') {
        const state = store.getValue();
        const query = state.search.query;
        if (query) {
            let fuse: DocumentFuse | undefined = searchState.fuse.get(store);
            if (!fuse) {
                const items: { id: string; content: string }[] = [];
                for (const id of Object.keys(state.document.content)) {
                    const content = state.document.content[id]?.content;
                    if (content) {
                        items.push({
                            id,
                            content,
                        });
                    }
                }
                fuse = new Fuse(items, {
                    keys: ['content'],
                    threshold: 0.4,
                    minMatchCharLength: 2,
                    shouldSort: true,
                    isCaseSensitive: false,
                    ignoreLocation: true,
                });
                searchState.fuse.set(store, fuse);
            }

            const results = fuse.search(query);

            store.dispatch({
                type: 'SEARCH/SET_RESULTS',
                payload: {
                    results: results.map((r) => r.item.id),
                },
            });

            const shouldUpdateActiveNode =
                results.length > 0 &&
                !results.find(
                    (r) => r.item.id === state.document.state.activeNode,
                );
            if (shouldUpdateActiveNode) {
                store.dispatch({
                    type: 'DOCUMENT/SET_ACTIVE_NODE',
                    payload: {
                        id: results[0].item.id,
                    },
                });
            }
        }
    }
};
