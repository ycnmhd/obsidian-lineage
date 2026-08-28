import { LineageView } from 'src/view/view';
import Fuse, { FuseResult } from 'fuse.js';

type SearchItem = { id: string; content: string };

export type NodeSearchResult = FuseResult<SearchItem>;

export class DocumentSearch {
    constructor(private view: LineageView) {}
    private fuse: Fuse<SearchItem> | null;
    #searchTriggeredMinimap: boolean;

    private updateIndex = () => {
        const documentState = this.view.documentStore.getValue();
        const viewState = this.view.viewStore.getValue();
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
        this.fuse = new Fuse(items, {
            keys: ['content'],
            threshold: viewState.search.fuzzySearch ? 0.4 : 0,
            shouldSort: true,
            isCaseSensitive: false,
            ignoreLocation: true,
            includeMatches: true,
        });
    };

    resetIndex = () => {
        this.fuse = null;
    };

    search = (query: string) => {
        if (!this.fuse) {
            this.updateIndex();
        }
        const results = this.fuse!.search(query);
        const map: Map<string, NodeSearchResult> = new Map();
        for (const result of results) {
            map.set(result.item.id, result);
        }
        return map;
    };

    get searchTriggeredMinimap() {
        return this.#searchTriggeredMinimap;
    }
    set searchTriggeredMinimap(value: boolean) {
        this.#searchTriggeredMinimap = value;
    }
}
