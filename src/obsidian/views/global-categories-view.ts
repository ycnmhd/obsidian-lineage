import { ItemView, WorkspaceLeaf } from 'obsidian';
import Lineage from 'src/main';
import { customIcons } from 'src/helpers/load-custom-icons';
import GlobalCategoriesComponent from 'src/view/components/global-categories/global-categories.svelte';
import { subscribeGlobalViewCssVariables } from 'src/view/components/global-categories/helpers/apply-global-view-css-variables';
import { lang } from 'src/lang/lang';
import { Unsubscriber } from 'svelte/store';

export const GLOBAL_CATEGORIES_VIEW_TYPE = 'lineage-global-categories';

export class GlobalCategoriesView extends ItemView {
    private component: GlobalCategoriesComponent | null = null;
    private cssVariablesUnsubscriber: Unsubscriber | null = null;

    constructor(
        leaf: WorkspaceLeaf,
        public plugin: Lineage,
    ) {
        super(leaf);
    }

    getViewType() {
        return GLOBAL_CATEGORIES_VIEW_TYPE;
    }

    getDisplayText() {
        return lang.global_categories_view_title;
    }

    getIcon() {
        return customIcons.folderTree.name;
    }

    async onOpen() {
        this.component = new GlobalCategoriesComponent({
            target: this.contentEl,
            props: {
                plugin: this.plugin,
                leaf: this.leaf,
                containerEl: this.contentEl,
            },
        });
        // cards in the global view use the same theme variables as the main
        // view (card width, colors, opacity, …)
        this.cssVariablesUnsubscriber = subscribeGlobalViewCssVariables(
            this.plugin,
            this.contentEl,
        );
    }

    async onClose() {
        if (this.cssVariablesUnsubscriber) {
            this.cssVariablesUnsubscriber();
            this.cssVariablesUnsubscriber = null;
        }
        if (this.component) {
            this.component.$destroy();
            this.component = null;
        }
        this.contentEl.empty();
    }
}
