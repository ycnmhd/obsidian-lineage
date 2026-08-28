import { Modal } from 'obsidian';
import Lineage from 'src/main';
import { lang } from 'src/lang/lang';
import { AddTarget } from 'src/obsidian/commands/helpers/add-card-to-global-category';
import AddToGlobalCategory from './components/add-to-global-category.svelte';

export type AddToGlobalCategoryModalProps = {
    plugin: Lineage;
    target: AddTarget;
};

export class AddToGlobalCategoryModal extends Modal {
    private component: AddToGlobalCategory | null = null;

    constructor(private props: AddToGlobalCategoryModalProps) {
        super(props.plugin.app);
    }

    open = () => {
        this.setTitle(lang.add_to_global_category_title);
        this.component = new AddToGlobalCategory({
            target: this.contentEl,
            props: {
                plugin: this.props.plugin,
                target: this.props.target,
                onClose: () => this.close(),
            },
        });
        super.open();
    };

    close = () => {
        if (this.component) {
            this.component.$destroy();
            this.component = null;
        }
        super.close();
    };
}

/** Convenience: open the modal for the resolved target. */
export const openAddToGlobalCategoryModal = (
    plugin: Lineage,
    target: AddTarget,
) => {
    new AddToGlobalCategoryModal({ plugin, target }).open();
};
