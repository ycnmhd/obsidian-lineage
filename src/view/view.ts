import { IconName, Notice, TextFileView, WorkspaceLeaf } from 'obsidian';

import Component from './components/container/main.svelte';
import Lineage from '../main';
import { documentReducer } from 'src/stores/document/document-reducer';
import { Unsubscriber } from 'svelte/store';
import { columnsToJsonTree } from 'src/stores/view/helpers/json-to-md/columns-to-json/columns-to-json-tree';
import { jsonToMarkdown } from 'src/stores/view/helpers/json-to-md/json-to-makdown/json-to-markdown';
import { OnError, Store } from 'src/helpers/store/store';
import { defaultDocumentState } from 'src/stores/document/default-document-state';
import { DocumentState } from 'src/stores/document/document-state-type';
import { stores } from 'src/view/helpers/stores-cache';
import { clone } from 'src/helpers/clone';
import { extractFrontmatter } from 'src/view/helpers/extract-frontmatter';
import { DocumentStoreAction } from 'src/stores/document/document-store-actions';
import { setFileViewType } from 'src/obsidian/events/workspace/helpers/set-file-view-type';
import { ViewState } from 'src/stores/view/view-state-type';
import { ViewStoreAction } from 'src/stores/view/view-store-actions';
import { defaultViewState } from 'src/stores/view/default-view-state';
import { viewReducer } from 'src/stores/view/view-reducer';
import { viewSubscriptions } from 'src/stores/view/subscriptions/view-subscriptions';
import { SilentError } from 'src/stores/view/helpers/errors';
import { InlineEditor } from 'src/obsidian/helpers/inline-editor';

export const FILE_VIEW_TYPE = 'lineage';

export type DocumentStore = Store<DocumentState, DocumentStoreAction>;
export type ViewStore = Store<ViewState, ViewStoreAction>;

export class LineageView extends TextFileView {
    component: Component;
    documentStore: DocumentStore;
    viewStore: ViewStore;
    container: HTMLElement | null;
    inlineEditor: InlineEditor;
    private readonly onDestroyCallbacks: Set<Unsubscriber> = new Set();
    private activeFilePath: null | string;
    constructor(
        leaf: WorkspaceLeaf,
        public plugin: Lineage,
    ) {
        super(leaf);
        this.documentStore = new Store(
            defaultDocumentState(),
            documentReducer,
            this.onViewStoreError as OnError<DocumentStoreAction>,
        );
        this.viewStore = new Store(
            defaultViewState(),
            viewReducer,
            this.onViewStoreError as OnError<ViewStoreAction>,
        );
        this.inlineEditor = new InlineEditor(this);
    }

    get isActive() {
        return (
            this === this.plugin.app.workspace.getActiveViewOfType(LineageView)
        );
    }

    getViewData(): string {
        return this.data;
    }

    setViewData(data: string): void {
        if (!this.activeFilePath && this.file) {
            this.activeFilePath = this.file?.path;
            this.loadInitialData();
        }
        this.data = data;
    }
    async onUnloadFile() {
        if (this.component) {
            this.component.$destroy();
        }
        this.activeFilePath = null;
        this.contentEl.empty();
        this.documentStore = new Store(
            defaultDocumentState(),
            documentReducer,
            this.onViewStoreError as OnError<DocumentStoreAction>,
        );
        for (const s of this.onDestroyCallbacks) {
            s();
        }
    }

    clear(): void {
        this.data = '';
    }

    getViewType() {
        return FILE_VIEW_TYPE;
    }

    getIcon(): IconName {
        return 'list-tree';
    }

    getDisplayText() {
        return this.file ? this.file.basename : '';
    }

    async onOpen() {}

    /*private destroyStore = () => {
	   const leavesOfType = this.plugin.app.workspace
		   .getLeavesOfType(FILE_VIEW_TYPE)
		   .filter(
			   (l) =>
				   l.view instanceof LineageView &&
				   l.view.file?.path === this.activeFilePath &&
				   l.view !== this,
		   );
	   if (leavesOfType.length === 0) {
		   this.store.dispatch({ type: 'RESET_STORE' });
		   if (this.file) delete stores[this.file.path];
	   }
   };*/

    async onClose() {
        return this.onUnloadFile();
    }

    onViewStoreError: OnError<DocumentStoreAction | ViewStoreAction> = (
        error,
        location,
        action,
    ) => {
        if (action && action.type === 'DOCUMENT/LOAD_FILE') {
            if (this.file) {
                delete stores[this.file.path];
                setFileViewType(this.plugin, this.file, this.leaf, 'markdown');
            }
        }
        if (!(error instanceof SilentError)) {
            // eslint-disable-next-line no-console
            console.error(`[${location}] action: `, action);
            // eslint-disable-next-line no-console
            console.error(`[${location}]`, error);
            new Notice('Lineage plugin: ' + error.message);
        }
    };

    saveDocument = async () => {
        const state = clone(this.documentStore.getValue());
        const data: string =
            state.file.frontmatter +
            jsonToMarkdown(
                columnsToJsonTree(
                    state.document.columns,
                    state.document.content,
                ),
            );
        if (data !== this.data) {
            this.setViewData(data);
            this.requestSave();
        }
    };

    private loadInitialData = async () => {
        if (!this.file) {
            throw new Error('view does not have a file');
        }

        const fileHasAStore = stores[this.file.path];
        if (fileHasAStore) {
            this.useExistingStore();
        } else {
            this.createStore();
        }
        this.loadDocumentToStore();
        await this.inlineEditor.loadFile(this.file);
        this.component = new Component({
            target: this.contentEl,
            props: {
                plugin: this.plugin,
                view: this,
            },
        });
        this.container = this.contentEl.querySelector('#columns-container');
        if (!this.container) throw new Error('could not find container');
        this.onDestroyCallbacks.add(viewSubscriptions(this));
    };

    private createStore = () => {
        if (!this.file) {
            throw new Error('view does not have a file');
        }
        stores[this.file.path] = this.documentStore;
        this.documentStore.dispatch({
            type: 'FS/SET_FILE_PATH',
            payload: {
                path: this.file.path,
            },
        });
    };

    private useExistingStore = () => {
        if (!this.file) return;
        this.documentStore = stores[this.file.path];
    };

    private loadDocumentToStore = () => {
        const { data, frontmatter } = extractFrontmatter(this.data);

        this.documentStore.dispatch({
            payload: {
                document: { data: data, frontmatter, position: null },
            },
            type: 'DOCUMENT/LOAD_FILE',
        });
    };
}
