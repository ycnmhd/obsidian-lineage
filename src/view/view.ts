import { IconName, TextFileView, WorkspaceLeaf } from 'obsidian';

import Component from './components/container/main.svelte';
import Lineage from '../main';
import { ViewAction, viewReducer } from 'src/stores/view/view-reducer';
import { alignBranchEffect } from 'src/stores/view/effects/align-branch-effect/align-branch-effect';
import { Unsubscriber } from 'svelte/store';
import { saveDocumentEffect } from 'src/stores/view/effects/save-document-effect';
import { columnsToJsonTree } from 'src/stores/view/helpers/json-to-md/columns-to-json/columns-to-json-tree';
import { jsonToMarkdown } from 'src/stores/view/helpers/json-to-md/json-to-makdown/json-to-markdown';
import { Store } from 'src/helpers/store';
import { defaultViewState } from 'src/stores/view/default-view-state';
import { bringFocusToContainer } from 'src/stores/view/effects/bring-focus-to-container';
import { ViewState } from 'src/stores/view/view-state-type';
import { stores } from 'src/view/helpers/stores-cache';
import { clone } from 'src/helpers/clone';
import { extractFrontmatter } from 'src/view/helpers/extract-frontmatter';

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
        this.store = new Store(defaultViewState(), viewReducer);
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
        this.store = new Store(defaultViewState(), viewReducer);
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

        if (stores[this.file.path]) {
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
            saveDocumentEffect(this.store, this.requestSaveWrapper),
        );
        this.onDestroyCallbacks.add(
            alignBranchEffect(this.store, this.container),
        );
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
