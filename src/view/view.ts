import { IconName, Notice, TextFileView, WorkspaceLeaf } from 'obsidian';

import Component from './components/container/main.svelte';
import Lineage from '../main';
import { viewReducer } from 'src/stores/view/view-reducer';
import { alignBranchEffect } from 'src/stores/view/effects/view/align-branch-effect/align-branch-effect';
import { Unsubscriber } from 'svelte/store';
import { saveDocumentEffect } from 'src/stores/view/effects/file/save-document-effect';
import { columnsToJsonTree } from 'src/stores/view/helpers/json-to-md/columns-to-json/columns-to-json-tree';
import { jsonToMarkdown } from 'src/stores/view/helpers/json-to-md/json-to-makdown/json-to-markdown';
import { OnError, Store } from 'src/helpers/store/store';
import { defaultViewState } from 'src/stores/view/default-view-state';
import { bringFocusToContainer } from 'src/stores/view/effects/view/bring-focus-to-container';
import { ViewState } from 'src/stores/view/view-state-type';
import { stores } from 'src/view/helpers/stores-cache';
import { clone } from 'src/helpers/clone';
import { extractFrontmatter } from 'src/view/helpers/extract-frontmatter';
import { ViewAction } from 'src/stores/view/view-store-actions';
import { updateSearchResultsEffect } from 'src/stores/view/effects/file/update-search-results/update-search-results-effect';
import { changeZoomLevelEffect } from 'src/stores/view/effects/view/change-zoom-level-effect';
import { updateTreeIndexEffect } from 'src/stores/view/effects/file/update-tree-index/update-tree-index-effect';
import { toggleFileViewType } from 'src/obsidian/events/workspace/helpers/toggle-file-view-type';

export const FILE_VIEW_TYPE = 'lineage';

export type ViewStore = Store<ViewState, ViewAction>;

export class LineageView extends TextFileView {
    data: string;
    component: Component;
    store: ViewStore;
    private container: HTMLElement | null;
    private readonly onDestroyCallbacks: Set<Unsubscriber> = new Set();
    private activeFilePath: null | string;
    constructor(
        leaf: WorkspaceLeaf,
        private plugin: Lineage,
    ) {
        super(leaf);
        this.store = new Store(
            defaultViewState(),
            viewReducer,
            this.onViewStoreError,
        );
    }

    getViewData(): string {
        return this.data;
    }

    setViewData(data: string, clear: boolean): void {
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
        this.store = new Store(
            defaultViewState(),
            viewReducer,
            this.onViewStoreError,
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

    async onClose() {
        return this.onUnloadFile();
    }

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

    onViewStoreError: OnError<ViewAction> = (error, location, action) => {
        if (action && action.type === 'DOCUMENT/LOAD_FILE') {
            if (this.file) {
                delete stores[this.file.path];
                toggleFileViewType(this.plugin, this.file, this.leaf);
            }
        }
        // eslint-disable-next-line no-console
        console.error(`[${location}] action: `, action);
        // eslint-disable-next-line no-console
        console.error(`[${location}] `, error);
        new Notice('Lineage plugin: ' + error.message);
    };

    private requestSaveWrapper = async (actionType?: string) => {
        const state = clone(this.store.getValue());
        const data: string =
            state.file.frontmatter +
            jsonToMarkdown(
                columnsToJsonTree(
                    state.document.columns,
                    state.document.content,
                ),
            );
        if (data !== this.data) {
            this.setViewData(data, false);
            this.requestSave();
        }
    };
    private loadInitialData = () => {
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
        this.component = new Component({
            target: this.contentEl,
            props: {
                store: this.store,
                plugin: this.plugin,
                view: this,
            },
        });
        this.container = this.contentEl.querySelector('#columns-container');
        if (!this.container) throw new Error('could not find container');
        this.onDestroyCallbacks.add(
            bringFocusToContainer(this.store, this.container),
        );
        this.onDestroyCallbacks.add(
            alignBranchEffect(this.store, this.container),
        );
        this.onDestroyCallbacks.add(
            changeZoomLevelEffect(this.store, this.container),
        );
        if (!fileHasAStore) {
            saveDocumentEffect(this.store, this.requestSaveWrapper);
            updateSearchResultsEffect(this.store);
            updateTreeIndexEffect(this.store);
        }
    };

    private createStore = () => {
        if (!this.file) {
            throw new Error('view does not have a file');
        }
        stores[this.file.path] = this.store;
        this.store.dispatch({
            type: 'FS/SET_FILE_PATH',
            payload: {
                path: this.file.path,
            },
        });
    };
    private useExistingStore = () => {
        if (!this.file) return;
        this.store = stores[this.file.path];
    };

    private loadDocumentToStore = () => {
        const { data, frontmatter } = extractFrontmatter(this.data);

        this.store.dispatch({
            payload: {
                document: { data: data, frontmatter, position: null },
            },
            type: 'DOCUMENT/LOAD_FILE',
        });
    };
}
