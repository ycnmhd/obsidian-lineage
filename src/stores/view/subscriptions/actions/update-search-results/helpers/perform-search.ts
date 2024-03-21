import { DocumentStore } from 'src/view/view';
import Fuse from 'fuse.js';

type DocumentFuse = Fuse<{ id: string; content: string }>;
type State = {
    fuse: Map<DocumentStore, DocumentFuse>;
};
export const searchState: State = {
    fuse: new Map(),
};
export const performSearch = (documentStore: DocumentStore, query: string) => {
    let fuse: DocumentFuse | undefined = searchState.fuse.get(documentStore);
    if (!fuse) {
        const documentState = documentStore.getValue();
        const items: { id: string; content: string }[] = [];
        for (const id of Object.keys(documentState.document.content)) {
            const content = documentState.document.content[id]?.content;
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
            shouldSort: true,
            isCaseSensitive: false,
            ignoreLocation: true,
        });
        searchState.fuse.set(documentStore, fuse);
    }

    return fuse.search(query);
};
