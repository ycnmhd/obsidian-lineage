import { IconName, TextFileView, WorkspaceLeaf } from 'obsidian';

import Component from './components/container/main.svelte';
import Lineage from '../main';
import {
    DocumentAction,
    documentReducer,
    DocumentState,
} from 'src/stores/document/document-reducer';
import { alignBranchEffect } from 'src/stores/document/effects/align-branch-effect';
import { Unsubscriber } from 'svelte/store';
import { saveDocumentEffect } from 'src/stores/document/effects/save-document-effect';
import { columnsToJsonTree } from 'src/stores/document/helpers/json-to-md/columns-to-json/columns-to-json-tree';
import { jsonToMarkdown } from 'src/stores/document/helpers/json-to-md/json-to-makdown/json-to-markdown';
import { Store } from 'src/helpers/store';
import { initialDocumentState } from 'src/stores/document/helpers/initial-document-state';
import { bringFocusToContainer } from 'src/stores/document/effects/bring-focus-to-container';
import { fileHistoryStore } from 'src/stores/file-history/file-history-store';
import { findNode } from 'src/stores/document/helpers/find-node';
import { findNodePosition } from 'src/stores/document/helpers/find-branch';
import { stores } from 'src/view/helpers/stores-cache';
import { clone } from 'src/helpers/clone';
import { extractFrontmatter } from 'src/view/helpers/extract-frontmatter';

export const FILE_VIEW_TYPE = 'lineage';

export type DocumentStore = Store<DocumentState, DocumentAction>;

export class LineageView extends TextFileView {
    data: string;
    component: Component;
    store: DocumentStore;
    private container: HTMLElement | null;
    private readonly onDestroyCallbacks: Set<Unsubscriber> = new Set();
    private activeFilePath: null | string;
    constructor(
        leaf: WorkspaceLeaf,
        private plugin: Lineage,
    ) {
        super(leaf);
        this.store = new Store(initialDocumentState(), documentReducer);
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
        this.detachFromStore();
        this.activeFilePath = null;
        this.data = '';
        this.contentEl.empty();
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
        if (this.component) {
            this.component.$destroy();
        }
        this.detachFromStore();
        for (const s of this.onDestroyCallbacks) {
            s();
        }
    }

    private detachFromStore = () => {
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
    };

    private requestSaveWrapper = async (actionType?: string) => {
        const state = clone(this.store.getValue());
        const data: string =
            state.file.frontmatter +
            jsonToMarkdown(columnsToJsonTree(state.columns));
        if (data !== this.data) {
            if (actionType !== 'APPLY_SNAPSHOT') {
                const path = this.file?.path;
                if (!path) throw new Error('view does not have a file');
                const node = findNode(
                    state.columns,
                    state.state.activeBranch.node,
                );

                fileHistoryStore.dispatch({
                    type: 'ADD_SNAPSHOT',
                    payload: {
                        data: data,
                        path,
                        position: node
                            ? findNodePosition(state.columns, node)
                            : null,
                        actionType: actionType ? actionType : null,
                    },
                });
            }
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
        this.component = new Component({
            target: this.contentEl,
            props: {
                store: this.store,
                plugin: this.plugin,
            },
        });
        this.container = this.contentEl.querySelector('#columns-container');
        if (!this.container) throw new Error('could not find container');
        this.onDestroyCallbacks.add(
            alignBranchEffect(this.store, this.container),
        );
        this.onDestroyCallbacks.add(
            saveDocumentEffect(this.store, this.requestSaveWrapper),
        );
        this.onDestroyCallbacks.add(
            bringFocusToContainer(this.store, this.container),
        );
        this.store.dispatch({ type: 'EVENT/VIEW_LOADED' });
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
        fileHistoryStore.dispatch({
            type: 'ADD_SNAPSHOT',
            payload: {
                data: this.data,
                path: this.file.path,
                position: null,
                actionType: 'INITIAL_DOCUMENT',
            },
        });
        const { data, frontmatter } = extractFrontmatter(this.data);

        this.store.dispatch({
            payload: {
                document: { data: data, frontmatter, position: null },
            },
            type: 'FILE/LOAD_DOCUMENT',
        });
    };
    private useExistingStore = () => {
        if (!this.file) return;
        this.store = stores[this.file.path];
    };
}
