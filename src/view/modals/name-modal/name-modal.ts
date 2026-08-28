import { Modal, TextAreaComponent, ButtonComponent } from 'obsidian';
import Lineage from 'src/main';
import { lang } from 'src/lang/lang';

export type NameModalProps = {
    plugin: Lineage;
    title: string;
    placeholder: string;
    initialValue?: string;
    submitLabel?: string;
};

export class NameModal extends Modal {
    private resolve: (value: string | null) => void;
    private input: TextAreaComponent | null = null;

    constructor(private props: NameModalProps) {
        super(props.plugin.app);
    }

    open = () => {
        this.modalEl.addClass('lineage-name-modal');
        this.setTitle(this.props.title);

        const container = this.contentEl.createDiv({
            cls: 'name-modal-content',
        });

        this.input = new TextAreaComponent(container)
            .setValue(this.props.initialValue ?? '')
            .setPlaceholder(this.props.placeholder)
            .then((comp) => {
                comp.inputEl.addClass('name-modal-input');
                setTimeout(() => {
                    comp.inputEl.focus();
                    comp.inputEl.select();
                }, 50);
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
            .setButtonText(this.props.submitLabel ?? lang.modal_button_create)
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
