import { IconName, TextFileView, WorkspaceLeaf } from 'obsidian';

import Component from './components/container/main.svelte';
import Lineage from '../main';
import { documentReducer } from 'src/stores/document/document-reducer';
import { Unsubscriber } from 'svelte/store';
import { columnsToJson } from 'src/lib/data-conversion/columns-to-json';
import { jsonToSections } from 'src/lib/data-conversion/json-to-sections';
import { OnError, Store } from 'src/lib/store/store';
import { defaultDocumentState } from 'src/stores/document/default-document-state';
import { DocumentState } from 'src/stores/document/document-state-type';
import { clone } from 'src/helpers/clone';
import { extractFrontmatter } from 'src/view/helpers/extract-frontmatter';
import { DocumentStoreAction } from 'src/stores/document/document-store-actions';
import { setFileViewType } from 'src/obsidian/events/workspace/helpers/set-file-view-type';
import { ViewState } from 'src/stores/view/view-state-type';
import { ViewStoreAction } from 'src/stores/view/view-store-actions';
import { defaultViewState } from 'src/stores/view/default-view-state';
import { viewReducer } from 'src/stores/view/view-reducer';
import { viewSubscriptions } from 'src/stores/view/subscriptions/view-subscriptions';
import { onPluginError } from 'src/lib/store/on-plugin-error';
import { InlineEditor } from 'src/obsidian/helpers/inline-editor';
import { id } from 'src/helpers/id';
import invariant from 'tiny-invariant';
import { customIcons } from 'src/helpers/load-custom-icons';

export const FILE_VIEW_TYPE = 'lineage';

export type DocumentStore = Store<DocumentState, DocumentStoreAction>;
export type ViewStore = Store<ViewState, ViewStoreAction>;

export class LineageView extends TextFileView {
    component: Component;
    documentStore: DocumentStore;
    viewStore: ViewStore;
    container: HTMLElement | null;
    inlineEditor: InlineEditor;
    id: string;
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
        this.id = id.view();
    }

    get isActive() {
        return (
            this === this.plugin.app.workspace.getActiveViewOfType(LineageView)
        );
    }

    get isViewOfFile() {
        const path = this.file?.path;
        return path
            ? this.id ===
                  this.plugin.documents.getValue().documents[path]?.viewId
            : false;
    }

    getViewData(): string {
        return this.data;
    }

    setViewData(data: string): void {
        if (!this.activeFilePath && this.file) {
            this.activeFilePath = this.file?.path;
            this.loadInitialData();
        } else {
            this.data = data;
            this.loadDocumentToStore();
        }
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
        if (this.inlineEditor) await this.inlineEditor.unloadFile();
        for (const s of this.onDestroyCallbacks) {
            s();
        }
        this.deleteBackup();
    }

    clear(): void {
        this.data = '';
    }

    getViewType() {
        return FILE_VIEW_TYPE;
    }

    getIcon(): IconName {
        return customIcons.cards.name;
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
                this.plugin.documents.dispatch({
                    type: 'DOCUMENTS/DELETE_DOCUMENT',
                    payload: { path: this.file.path },
                });
                setFileViewType(this.plugin, this.file, this.leaf, 'markdown');
            }
        }
        onPluginError(error, location, action);
    };

    saveDocument = async (immediate = false, force = false) => {
        invariant(this.file);
        const state = clone(this.documentStore.getValue());
        const data: string =
            state.file.frontmatter +
            jsonToSections(
                columnsToJson(state.document.columns, state.document.content),
            );
        if (data !== this.data || force) {
            this.data = data;
            if (immediate) await this.save();
            else this.requestSave();
            this.deleteBackup();
        }
    };

    deleteBackup = () => {
        if (this.file && this.plugin.documents.getValue().processedBackups) {
            this.plugin.settings.dispatch({
                type: 'BACKUP/DELETE_FILE',
                payload: {
                    path: this.file.path,
                },
            });
        }
    };

    private loadInitialData = async () => {
        invariant(this.file);

        const fileHasAStore =
            this.plugin.documents.getValue().documents[this.file.path];
        if (fileHasAStore) {
            this.useExistingStore();
        } else {
            this.createStore();
        }
        this.loadDocumentToStore();
        if (!this.inlineEditor) {
            this.inlineEditor = new InlineEditor(this);
            await this.inlineEditor.onload();
        }
        await this.inlineEditor.loadFile(this.file);
        this.component = new Component({
            target: this.contentEl,
            props: {
                plugin: this.plugin,
                view: this,
            },
        });
        this.container = this.contentEl.querySelector('#columns-container');
        invariant(this.container);
        this.onDestroyCallbacks.add(viewSubscriptions(this));
    };

    private createStore = () => {
        invariant(this.file);

        this.plugin.documents.dispatch({
            type: 'DOCUMENTS/ADD_DOCUMENT',
            payload: {
                path: this.file.path,
                documentStore: this.documentStore,
                viewId: this.id,
            },
        });
        this.documentStore.dispatch({
            type: 'FS/SET_FILE_PATH',
            payload: {
                path: this.file.path,
            },
        });
    };

    private useExistingStore = () => {
        if (!this.file) return;
        this.documentStore =
            this.plugin.documents.getValue().documents[
                this.file.path
            ].documentStore;
    };

    private loadDocumentToStore = () => {
        const { data, frontmatter } = extractFrontmatter(this.data);

        const state = this.documentStore.getValue();
        const existingData = jsonToSections(
            columnsToJson(state.document.columns, state.document.content),
        );
        if (!existingData || existingData !== data)
            this.documentStore.dispatch({
                payload: {
                    document: { data: data, frontmatter, position: null },
                },
                type: 'DOCUMENT/LOAD_FILE',
            });
    };
}
