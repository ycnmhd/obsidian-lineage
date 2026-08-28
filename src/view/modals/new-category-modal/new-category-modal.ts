import { Modal, TextAreaComponent, ButtonComponent } from 'obsidian';
import Lineage from 'src/main';
import { lang } from 'src/lang/lang';

export type NewCategoryModalProps = {
    plugin: Lineage;
};

export class NewCategoryModal extends Modal {
    private resolve: (value: string | null) => void;
    private input: TextAreaComponent | null = null;

    constructor(private props: NewCategoryModalProps) {
        super(props.plugin.app);
    }

    open = () => {
        this.modalEl.addClass('lineage-new-category-modal');
        this.setTitle(lang.cm_create_category);

        const container = this.contentEl.createDiv({
            cls: 'new-category-modal-content',
        });

        this.input = new TextAreaComponent(container)
            .setPlaceholder(lang.modal_new_category_placeholder)
            .then((comp) => {
                comp.inputEl.addClass('new-category-modal-input');
                // Focus on first open
                setTimeout(() => comp.inputEl.focus(), 50);
            });

        const buttonContainer = container.createDiv({
            cls: 'modal-button-container',
        });

        new ButtonComponent(buttonContainer)
            .setButtonText(lang.modal_button_cancel)
            .onClick(() => {
                this.resolve(null);
                super.close();
            });

        new ButtonComponent(buttonContainer)
            .setButtonText(lang.modal_button_create)
            .setCta()
            .onClick(() => {
                const value = this.input?.getValue()?.trim() ?? '';
                this.resolve(value || null);
                super.close();
            });

        // Handle Enter key
        this.input?.inputEl.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                const value = this.input?.getValue()?.trim() ?? '';
                this.resolve(value || null);
                super.close();
            }
        });

        const promise = new Promise<string | null>((resolve) => {
            this.resolve = resolve;
        });
        super.open();

        return promise;
    };

    onClose(): void {
        // Cleanup handled in close
    }
}
