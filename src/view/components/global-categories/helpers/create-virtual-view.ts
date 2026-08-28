import { Component, TFile, WorkspaceLeaf } from 'obsidian';
import Lineage from 'src/main';
import { Store } from 'src/lib/store/store';
import { DocumentState } from 'src/stores/document/document-state-type';
import { DocumentStoreAction } from 'src/stores/document/document-store-actions';
import { LineageView, ViewStore } from 'src/view/view';
import { InlineEditor } from 'src/obsidian/helpers/inline-editor/inline-editor';
import { stringifyDocument } from 'src/view/helpers/stringify-document';
import { LineageDocumentFormat } from 'src/stores/settings/settings-type';

export type VirtualView = LineageView & {
    /** replace the DOM container the card subtree uses for focus/link queries */
    setContainer: (el: HTMLElement | null) => void;
    /**
     * Unsubscribers registered while populating the view (document-store
     * subscriptions). Collected so the view can be torn down without leaking
     * listeners on the (possibly shared/background) document store.
     */
    unsubscribers?: (() => void)[];
};

/**
 * A lightweight object that behaves like a `LineageView` for the card
 * component tree (which reads `view.*` via svelte context) but is bound to a
 * specific file's document store. It extends `Component` so
 * `MarkdownRenderer.render` (which registers DOM event handlers on it) works.
 *
 * The instance is created synchronously (so it can be placed in svelte
 * context before any async work) and populated by `populateVirtualView`.
 */
export class VirtualLineageView extends Component {
    file!: TFile;
    plugin!: Lineage;
    documentStore!: Store<DocumentState, DocumentStoreAction>;
    viewStore!: ViewStore;
    inlineEditor!: InlineEditor;
    leaf!: WorkspaceLeaf;
    containerEl!: HTMLElement;
    container: HTMLElement | null = null;
    data = '';
    id = '';
    isActive = false;
    isViewOfFile = true;
    saveDocument: () => Promise<void> = async () => {};
    unsubscribers: (() => void)[] = [];

    setContainer(el: HTMLElement | null) {
        this.container = el;
    }
}

type PopulateVirtualViewOptions = {
    plugin: Lineage;
    file: TFile;
    documentStore: Store<DocumentState, DocumentStoreAction>;
    viewStore: ViewStore;
    leaf: WorkspaceLeaf;
    containerEl: HTMLElement;
    format: LineageDocumentFormat;
};

/**
 * Fills a `VirtualLineageView` with the bindings of one file.
 *
 * All virtual views share a single `viewStore` so only one card is edited at
 * a time, mirroring the sidebar behaviour.
 */
export const populateVirtualView = async (
    view: VirtualLineageView,
    options: PopulateVirtualViewOptions,
) => {
    const {
        plugin,
        file,
        documentStore,
        viewStore,
        leaf,
        containerEl,
        format,
    } = options;

    view.plugin = plugin;
    view.file = file;
    view.documentStore = documentStore;
    view.viewStore = viewStore;
    view.leaf = leaf;
    view.containerEl = containerEl;
    view.container = containerEl;
    view.id = 'virtual:' + file.path;
    view.saveDocument = async () => {};

    // Keep the view-store context pointing at this file's document so the
    // view reducer (active-branch/outline updates) never sees a stale doc.
    // Subscriptions are tracked on the view so `disposeVirtualView` can
    // remove them again (the stores may outlive the view).
    view.unsubscribers = view.unsubscribers ?? [];
    view.unsubscribers.push(
        documentStore.subscribe((state) => {
            viewStore.setContext(state.document);
        }),
    );
    viewStore.setContext(documentStore.getValue().document);

    const updateData = (state: DocumentState) => {
        view.data =
            state.file.frontmatter + stringifyDocument(state.document, format);
    };
    updateData(documentStore.getValue());
    view.unsubscribers.push(documentStore.subscribe(updateData));

    view.inlineEditor = new InlineEditor(view as unknown as LineageView);
    await view.inlineEditor.onload();
    await view.inlineEditor.loadFile(file);
};

/** Create and populate a fresh virtual view for a file. */
export const createVirtualView = async (
    options: PopulateVirtualViewOptions,
): Promise<VirtualView> => {
    const view = new VirtualLineageView();
    await populateVirtualView(view, options);
    return view as unknown as VirtualView;
};

/**
 * Tear a virtual view down: unloads the inline editor (saving any pending
 * edit) and unsubscribes from the document store. Call this when the host
 * (e.g. a popover) closes — the document store itself may live on.
 */
export const disposeVirtualView = async (view: VirtualView) => {
    try {
        await view.inlineEditor?.unloadFile?.();
    } catch (e) {
        // the editor may never have been fully initialised - ignore
    }
    for (const unsubscribe of (view.unsubscribers ?? []).splice(0)) {
        try {
            unsubscribe();
        } catch (e) {
            // ignore individual teardown failures
        }
    }
};
