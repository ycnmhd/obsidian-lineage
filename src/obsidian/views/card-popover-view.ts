import { ItemView, TFile, ViewStateResult, WorkspaceLeaf } from 'obsidian';
import Lineage from 'src/main';
import { customIcons } from 'src/helpers/load-custom-icons';
import { Store } from 'src/lib/store/store';
import { defaultViewState } from 'src/stores/view/default-view-state';
import { viewReducer } from 'src/stores/view/view-reducer';
import { onPluginError } from 'src/lib/store/on-plugin-error';
import { defaultDocumentState } from 'src/stores/document/default-document-state';
import { LineageDocument } from 'src/stores/document/document-state-type';
import { ViewState } from 'src/stores/view/view-state-type';
import { ViewStore } from 'src/view/view';
import { ViewStoreAction } from 'src/stores/view/view-store-actions';
import {
    createVirtualView,
    disposeVirtualView,
    VirtualView,
} from 'src/view/components/global-categories/helpers/create-virtual-view';
import {
    getDocumentStoreForFile,
    getOrDetectFormat,
} from 'src/view/components/global-categories/helpers/document-store-manager';
import { subscribeGlobalViewCssVariables } from 'src/view/components/global-categories/helpers/apply-global-view-css-variables';
import CardPopover from 'src/view/components/card-popover/card-popover.svelte';

export const LINEAGE_CARD_POPOVER_VIEW_TYPE = 'lineage-card-popover';

export type LineageCardPopoverState = {
    file?: string;
    nodeId?: string;
};

/**
 * A minimal view that shows exactly ONE card of a Lineage document.
 *
 * It is meant to be opened inside hover popovers (e.g. by the Hover Editor
 * plugin via `Lineage.openCardPopover`) when a link points at a specific
 * card/block of a Lineage document — instead of showing the whole document.
 *
 * The card is rendered with the same component used in the global categories
 * view, bound to a `VirtualLineageView` for the target file, so editing,
 * saving and styling behave exactly like the cards in the Lineage sidebar.
 */
export class LineageCardPopoverView extends ItemView {
    private component: CardPopover | null = null;
    private cssVariablesUnsubscriber: (() => void) | null = null;
    private virtualView: VirtualView | null = null;
    private cardFile: TFile | null = null;
    private nodeId: string | null = null;
    private section: string | null = null;
    private renderPromise: Promise<void> = Promise.resolve();

    constructor(
        leaf: WorkspaceLeaf,
        public plugin: Lineage,
    ) {
        super(leaf);
    }

    getViewType() {
        return LINEAGE_CARD_POPOVER_VIEW_TYPE;
    }

    getDisplayText() {
        const file = this.cardFile?.basename ?? 'Lineage card';
        return this.section ? `${file} · ${this.section}` : file;
    }

    getIcon() {
        return customIcons.cards.name;
    }

    /**
     * Show the card `nodeId` of `file`. Can be called after the view is open
     * (this is how the public API opens it) and replaces any card currently
     * rendered.
     */
    async showCard(file: TFile, nodeId: string) {
        this.cardFile = file;
        this.nodeId = nodeId;
        // serialize renders so rapid re-shows cannot interleave
        this.renderPromise = this.renderPromise.then(() => this.renderCard());
        await this.renderPromise;
    }

    private async renderCard() {
        const file = this.cardFile;
        const nodeId = this.nodeId;
        if (!file || !nodeId) return;

        this.destroyCard();

        // Reuse the store of an already open Lineage view (live-sync), or a
        // lazily created background store that persists edits to disk.
        const { documentStore } = await getDocumentStoreForFile(
            this.plugin,
            file,
        );
        if (this.cardFile !== file || this.nodeId !== nodeId) return; // superseded while loading

        this.section =
            documentStore.getValue().sections.id_section[nodeId] ?? null;

        // A dedicated view store per popover (unlike the shared one in the
        // global categories view) so active/editing state never leaks between
        // popovers and the sidebar.
        const viewStore: ViewStore = new Store<
            ViewState,
            ViewStoreAction,
            LineageDocument
        >(
            defaultViewState(),
            viewReducer,
            onPluginError,
            defaultDocumentState().document,
        );

        const virtualView = await createVirtualView({
            plugin: this.plugin,
            file,
            documentStore,
            viewStore,
            leaf: this.leaf,
            containerEl: this.contentEl,
            format: getOrDetectFormat(this.plugin, file.path),
        });
        if (this.cardFile !== file || this.nodeId !== nodeId) {
            await disposeVirtualView(virtualView);
            return;
        }
        this.virtualView = virtualView;

        // cards use the same theme variables as the main view (card width,
        // colors, opacity, …)
        this.cssVariablesUnsubscriber = subscribeGlobalViewCssVariables(
            this.plugin,
            this.contentEl,
        );

        this.component = new CardPopover({
            target: this.contentEl,
            props: {
                plugin: this.plugin,
                virtualView,
                nodeId,
            },
        });
    }

    private destroyCard() {
        this.component?.$destroy();
        this.component = null;
        this.cssVariablesUnsubscriber?.();
        this.cssVariablesUnsubscriber = null;
        const view = this.virtualView;
        this.virtualView = null;
        if (view) {
            void disposeVirtualView(view);
        }
    }

    async onOpen() {
        if (this.cardFile && this.nodeId) await this.renderCard();
    }

    async onClose() {
        this.destroyCard();
        this.contentEl.empty();
    }

    setState(state: LineageCardPopoverState, result: ViewStateResult) {
        const promise = super.setState(state as never, result);
        // The view-specific fields can sit directly on `state` or wrapped in
        // `state.state`, depending on how Obsidian routes the view state.
        const wrapped =
            (state as LineageCardPopoverState & {
                state?: LineageCardPopoverState;
            }) ?? {};
        const filePath =
            typeof wrapped.file === 'string'
                ? wrapped.file
                : wrapped.state?.file;
        const nodeId =
            typeof wrapped.nodeId === 'string'
                ? wrapped.nodeId
                : wrapped.state?.nodeId;
        const file =
            typeof filePath === 'string'
                ? this.app.vault.getAbstractFileByPath(filePath)
                : null;
        if (file instanceof TFile && nodeId) {
            return promise.then(() => this.showCard(file, nodeId));
        }
        return promise;
    }

    getState(): LineageCardPopoverState {
        return {
            ...(super.getState() as object),
            file: this.cardFile?.path,
            nodeId: this.nodeId ?? undefined,
        } as LineageCardPopoverState;
    }
}
