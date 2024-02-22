import { TextFileView, WorkspaceLeaf } from 'obsidian';

import Component from './components/container/container.svelte';
import TreeEdit from '../main';
import {
    DocumentAction,
    documentReducer,
    DocumentState,
    initialDocumentState,
    SavedDocument,
} from 'src/view/store/document-reducer';
import { alignBranchEffect } from 'src/view/store/effects/align-branch-effect';
import { Unsubscriber } from 'svelte/store';
import { saveDocumentEffect } from 'src/view/store/effects/save-document-effect';
import { columnsToJsonTree } from 'src/view/store/helpers/conversion/columns-to-json/columns-to-json-tree';
import { jsonToMarkdown } from 'src/view/store/helpers/conversion/json-to-makdown/json-to-markdown';
import { Store } from 'src/helpers/store';

export const TREE_VIEW_TYPE = 'tree';

export type DocumentStore = Store<DocumentState, DocumentAction>;

export class TreeView extends TextFileView {
    data: string;
    component: Component;
    private readonly store: DocumentStore;
    private readonly subscriptions: Set<Unsubscriber> = new Set();
    private loadedInitialData = false;
    constructor(
        leaf: WorkspaceLeaf,
        private plugin: TreeEdit,
    ) {
        super(leaf);
        this.store = new Store(initialDocumentState(), documentReducer);
    }

    getViewData(): string {
        return this.data;
    }

    setViewData(data: string, clear: boolean): void {
        this.data = data;
        if (!this.loadedInitialData) {
            this.loadedInitialData = true;
            this.loadInitialData();
        }
    }

    clear(): void {
        this.data = '';
    }

    getViewType() {
        return TREE_VIEW_TYPE;
    }

    getDisplayText() {
        return 'Example view';
    }

    async onOpen() {
        this.component = new Component({
            target: this.contentEl,
            props: {
                store: this.store,
            },
        });
    }

    async onClose() {
        if (this.component) {
            this.component.$destroy();
        }
        this.store.dispatch({ type: 'RESET_STORE' });
        for (const s of this.subscriptions) {
            s();
        }
    }

    private saveState = async () => {
        const store = this.store.getValue();
        const data: SavedDocument = jsonToMarkdown(
            columnsToJsonTree(store.columns),
        );
        this.setViewData(data, false);
        this.requestSave();
    };
    private loadInitialData = () => {
        this.subscriptions.add(alignBranchEffect(this.store));
        this.subscriptions.add(saveDocumentEffect(this.store, this.saveState));
        if (!this.data) this.store.dispatch({ type: 'CREATE_FIRST_NODE' });
        else {
            const state = this.data as SavedDocument;
            this.store.dispatch({
                payload: { data: state },
                type: 'LOAD_DATA',
            });
        }
    };
}
