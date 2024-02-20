import { TextFileView, WorkspaceLeaf } from 'obsidian';

import Component from './view/components/container/container.svelte';
import store from './store';
import TreeEdit from './main';
import { documentStore } from 'src/view/store/document.store';
import { alignBranchEffect } from 'src/view/store/effects/align-branch-effect';

export const TREE_VIEW_TYPE = 'example-view';

export class TreeView extends TextFileView {
    data: string;
    component: Component;

    constructor(
        leaf: WorkspaceLeaf,
        private plugin: TreeEdit,
    ) {
        super(leaf);
    }

    getViewData(): string {
        return this.data;
    }

    setViewData(data: string, clear: boolean): void {
        this.data = data;
    }

    clear(): void {
        this.data = '{}';
    }

    getViewType() {
        return TREE_VIEW_TYPE;
    }

    getDisplayText() {
        return 'Example view';
    }

    async onOpen() {
        store.plugin.set(this.plugin);
        alignBranchEffect();
        documentStore.dispatch({ type: 'CREATE_FIRST_NODE' });
        this.component = new Component({
            target: this.contentEl,
            props: {},
        });
    }

    async onClose() {
        if (this.component) {
            this.component.$destroy();
        }
        documentStore.dispatch({ type: 'RESET_STORE' });
    }
}
