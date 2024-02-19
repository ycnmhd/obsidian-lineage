import { TextFileView, WorkspaceLeaf } from 'obsidian';

import Component from './Component.svelte';
import store from './store';
import TreeEdit from './main';

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
        this.component = new Component({
            target: this.contentEl,
            props: {
                variable: 1,
            },
        });
    }

    async onClose() {
        this.component.$destroy();
    }
}
