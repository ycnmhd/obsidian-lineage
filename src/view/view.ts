import {
    debounce,
    IconName,
    Notice,
    TextFileView,
    WorkspaceLeaf,
} from 'obsidian';

import Component from './components/container/main.svelte';
import Lineage from '../main';
import { documentReducer } from 'src/stores/document/document-reducer';
import { Unsubscriber } from 'svelte/store';
import { OnError, Store } from 'src/lib/store/store';
import { defaultDocumentState } from 'src/stores/document/default-document-state';
import {
    DocumentState,
    LineageDocument,
} from 'src/stores/document/document-state-type';
import { clone } from 'src/helpers/clone';
import { extractFrontmatter } from 'src/view/helpers/extract-frontmatter';
import { DocumentStoreAction } from 'src/stores/document/document-store-actions';
import { ViewState } from 'src/stores/view/view-state-type';
import { ViewStoreAction } from 'src/stores/view/view-store-actions';
import { defaultViewState } from 'src/stores/view/default-view-state';
import { viewReducer } from 'src/stores/view/view-reducer';
import { viewSubscriptions } from 'src/stores/view/subscriptions/view-subscriptions';
import { onPluginError } from 'src/lib/store/on-plugin-error';
import { InlineEditor } from 'src/obsidian/helpers/inline-editor/inline-editor';
import { id } from 'src/helpers/id';
import invariant from 'tiny-invariant';
import { customIcons } from 'src/helpers/load-custom-icons';

import { setViewType } from 'src/stores/settings/actions/set-view-type';
import { getPersistedDocumentFormat } from 'src/obsidian/events/workspace/helpers/get-persisted-document-format';
import { stringifyDocument } from 'src/view/helpers/stringify-document';
import { setDocumentFormat } from 'src/stores/settings/actions/set-document-format';
import { toggleObsidianViewType } from 'src/obsidian/events/workspace/effects/toggle-obsidian-view-type';
import { DocumentSearch } from 'src/stores/view/subscriptions/effects/document-search/document-search';
import {
    MinimapDomElements,
    MinimapState,
} from 'src/stores/minimap/minimap-state-type';
import { MinimapStoreAction } from 'src/stores/minimap/minimap-store-actions';
import { StyleRulesProcessor } from 'src/stores/view/subscriptions/effects/style-rules/style-rules-processor';
import { AlignBranch } from 'src/stores/view/subscriptions/effects/align-branch/align-branch';
import { lang } from 'src/lang/lang';
import { DebouncedMinimapEffects } from 'src/stores/minimap/subscriptions/effects/debounced-minimap-effects';
import { updateFrontmatter } from 'src/stores/view/subscriptions/actions/document/update-frontmatter';
import { loadFullDocument } from 'src/stores/view/subscriptions/actions/document/load-full-document';
import { refreshActiveViewOfDocument } from 'src/stores/plugin/actions/refresh-active-view-of-document';
import { detectDocumentFormat } from 'src/lib/format-detection/detect-document-format';
import { LineageDocumentFormat } from 'src/stores/settings/settings-type';

export const LINEAGE_VIEW_TYPE = 'lineage';

export type DocumentStore = Store<DocumentState, DocumentStoreAction>;
export type ViewStore = Store<ViewState, ViewStoreAction, LineageDocument>;
export type MinimapStore = Store<MinimapState, MinimapStoreAction>;

export class LineageView extends TextFileView {
    component: Component;
    documentStore: DocumentStore;
    viewStore: ViewStore;
    minimapStore: MinimapStore | null;
    minimapEffects: DebouncedMinimapEffects;
    container: HTMLElement | null;
    inlineEditor: InlineEditor;
    documentSearch: DocumentSearch;
    rulesProcessor: StyleRulesProcessor;
    alignBranch: AlignBranch;
    id: string;
    zoomFactor: number;
    minimapDom: MinimapDomElements | null = null;
    private readonly onDestroyCallbacks: Set<Unsubscriber> = new Set();
    private activeFilePath: null | string;
    // Track classes applied from frontmatter so we can remove them later
    private currentAppliedCssClasses: string[] = [];

    constructor(
        leaf: WorkspaceLeaf,
        public plugin: Lineage,
    ) {
        super(leaf);
        this.documentStore = new Store(
            defaultDocumentState(),
            documentReducer,
            this.onViewStoreError as OnError<DocumentStoreAction>,
        );
        this.viewStore = new Store<ViewState, ViewStoreAction, LineageDocument>(
            defaultViewState(),
            viewReducer,
            this.onViewStoreError as OnError<ViewStoreAction>,
            this.documentStore.getValue().document,
        );

        this.id = id.view();
        this.documentSearch = new DocumentSearch(this);
        this.rulesProcessor = new StyleRulesProcessor(this);
        this.alignBranch = new AlignBranch(this);
        this.minimapEffects = new DebouncedMinimapEffects();
    }

    get isActive() {
        return (
            this === this.plugin.app.workspace.getActiveViewOfType(LineageView)
        );
    }

    get isViewOfFile() {
        const path = this.file?.path;
        return path
            ? this.id === this.plugin.store.getValue().documents[path]?.viewId
            : false;
    }

    getViewData(): string {
        return this.data;
    }

    setViewData(data: string): void {
        if (!this.activeFilePath && this.file) {
            this.activeFilePath = this.file?.path;
            this.loadInitialData();
        } else {
            this.data = data;
            if (this.isViewOfFile) this.debouncedLoadDocumentToStore();
        }
    }

    async onUnloadFile() {
        // remove frontmatter classes for the current file, if any
        this.removeAppliedFrontmatterCssClasses();

        if (this.component) {
            this.component.$destroy();
        }
        this.activeFilePath = null;
        this.contentEl.empty();
        this.documentStore = new Store(
            defaultDocumentState(),
            documentReducer,
            this.onViewStoreError as OnError<DocumentStoreAction>,
        );
        if (this.inlineEditor) await this.inlineEditor.unloadFile();
        for (const s of this.onDestroyCallbacks) {
            s();
        }
        refreshActiveViewOfDocument(this);
    }

    clear(): void {
        this.data = '';
    }

    getViewType() {
        return LINEAGE_VIEW_TYPE;
    }

    getIcon(): IconName {
        return customIcons.cards.name;
    }

    getDisplayText() {
        return this.file ? this.file.basename : '';
    }

    async onOpen() {}

    async onClose() {
        return this.onUnloadFile();
    }

    onViewStoreError: OnError<DocumentStoreAction | ViewStoreAction> = (
        error,
        location,
        action,
    ) => {
        if (action && action.type === 'document/file/load-from-disk') {
            if (this.file) {
                this.plugin.store.dispatch({
                    type: 'plugin/documents/unregister-document-store',
                    payload: { path: this.file.path },
                });
                setViewType(this.plugin, this.file.path, 'markdown');
                toggleObsidianViewType(
                    this.plugin,
                    this.plugin.app.workspace.getLeaf(),
                    'markdown',
                );
            }
        }
        onPluginError(error, location, action);
    };

    saveDocument = async () => {
        invariant(this.file);
        const state = clone(this.documentStore.getValue());
        const data: string =
            state.file.frontmatter +
            stringifyDocument(state.document, getPersistedDocumentFormat(this));
        if (data !== this.data) {
            if (data.trim().length === 0) {
                throw new Error(lang.error_save_empty_data);
            }
            this.data = data;
            this.requestSave();
        }
    };

    private loadInitialData = async () => {
        invariant(this.file);

        const pluginState = this.plugin.store.getValue();
        const fileHasAStore = pluginState.documents[this.file.path];
        if (fileHasAStore) {
            this.useExistingStore();
        } else {
            this.createStore();
        }
        this.loadDocumentToStore('view-mount');
        if (!this.inlineEditor) {
            this.inlineEditor = new InlineEditor(this);
            await this.inlineEditor.onload();
        }
        await this.inlineEditor.loadFile(this.file);
        this.component = new Component({
            target: this.contentEl,
            props: {
                plugin: this.plugin,
                view: this,
            },
        });

        // Apply any frontmatter `cssclasses` to the view after component mount
        this.applyFrontmatterCssClasses();

        invariant(this.container);
        this.onDestroyCallbacks.add(viewSubscriptions(this));
    };

    private createStore = () => {
        invariant(this.file);

        this.plugin.store.dispatch({
            type: 'plugin/documents/register-new-document-store',
            payload: {
                path: this.file.path,
                documentStore: this.documentStore,
                viewId: this.id,
            },
        });
    };

    private useExistingStore = () => {
        if (!this.file) return;
        this.documentStore =
            this.plugin.store.getValue().documents[
                this.file.path
            ].documentStore;
    };

    private loadDocumentToStore = (event?: 'view-mount') => {
        const { body, frontmatter } = extractFrontmatter(this.data);

        const documentState = this.documentStore.getValue();
        const viewState = this.viewStore.getValue();
        const format = this.getDocumentFormat(body);
        const emptyStore = documentState.history.items.length === 0;
        const existingBody = stringifyDocument(documentState.document, format);

        const bodyHasChanged = existingBody !== body;
        const frontmatterHasChanged =
            frontmatter !== documentState.file.frontmatter;

        const isEditing = Boolean(viewState.document.editing.activeNodeId);

        const activeNode = viewState.document.activeNode;
        const activeSection = activeNode
            ? documentState.sections.id_section[activeNode]
            : null;
        if (emptyStore || (bodyHasChanged && !isEditing)) {
            loadFullDocument(this, body, frontmatter, format, activeSection);
            if (this.isActive && event !== 'view-mount') {
                new Notice('Document updated externally');
            }
        } else if (frontmatterHasChanged) {
            updateFrontmatter(this, frontmatter);
        }
    };

    private getDocumentFormat(body: string) {
        let format: LineageDocumentFormat;
        format = getPersistedDocumentFormat(this, false);
        if (format) {
            return format;
        }

        format =
            detectDocumentFormat(body) ||
            this.plugin.settings.getValue().general.defaultDocumentFormat;

        setDocumentFormat(this.plugin, this.file!.path, format);
        return format;
    }

    private debouncedLoadDocumentToStore = debounce(
        this.loadDocumentToStore,
        250,
    );

    setMinimapDom(dom: MinimapDomElements) {
        this.minimapDom = dom;
    }

    getMinimapDom() {
        invariant(this.minimapDom);
        return this.minimapDom;
    }

    getMinimapStore() {
        invariant(this.minimapStore);
        return this.minimapStore;
    }

    // --- Frontmatter cssclasses support ---
    // Only read 'cssclasses' from frontmatter. Support YAML list or space-separated string.
    private getFrontmatterCssClasses(): string[] {
        if (!this.file) return [];
        const cache = this.plugin.app.metadataCache.getFileCache(
            this.file,
        ) as unknown as {
            frontmatter?: Record<string, unknown>;
        };
        const fm = cache?.frontmatter ?? {};
        const raw = fm.cssclasses;
        if (!raw) return [];
        if (Array.isArray(raw)) {
            return raw
                .map(String)
                .flatMap((s) => s.split(/\s+/))
                .filter(Boolean);
        }
        if (typeof raw === 'string') {
            return raw.split(/\s+/).filter(Boolean);
        }
        return String(raw).split(/\s+/).filter(Boolean);
    }

    // Apply cssclasses to both contentEl and the workspace leaf element (closest .workspace-leaf).
    private applyFrontmatterCssClasses(): void {
        const classes = this.getFrontmatterCssClasses();
        // Debug helper - remove if too verbose
        // eslint-disable-next-line no-console
        console.log(
            '[Lineage] applyFrontmatterCssClasses',
            this.file?.path,
            classes,
        );

        // Remove any previously applied classes first
        this.removeAppliedFrontmatterCssClasses();

        if (!classes.length) return;

        // Apply to contentEl
        const contentElWithClassMethods = this.contentEl as unknown as {
            addClasses?: (classes: string[]) => void;
        };
        if (contentElWithClassMethods?.addClasses) {
            try {
                contentElWithClassMethods.addClasses(classes);
            } catch {
                classes.forEach((c) => this.contentEl.classList.add(c));
            }
        } else {
            classes.forEach((c) => this.contentEl.classList.add(c));
        }

        // Apply to workspace leaf container element (robust lookup).
        // Some Obsidian types may not expose `containerEl` on the leaf, so we
        // find the DOM ancestor instead.
        const leafContainer =
            ((this.leaf as unknown as { containerEl?: HTMLElement })
                ?.containerEl as HTMLElement | undefined) ??
            (this.contentEl?.closest('.workspace-leaf') as HTMLElement | null);

        if (leafContainer) {
            const leafWithClassMethods = leafContainer as unknown as {
                addClasses?: (classes: string[]) => void;
            };
            if (leafWithClassMethods.addClasses) {
                try {
                    leafWithClassMethods.addClasses(classes);
                } catch {
                    classes.forEach((c) => leafContainer.classList.add(c));
                }
            } else {
                classes.forEach((c) => leafContainer.classList.add(c));
            }
        }

        this.currentAppliedCssClasses = classes;
    }

    // Remove classes from both contentEl and the workspace leaf element.
    private removeAppliedFrontmatterCssClasses(): void {
        if (!this.currentAppliedCssClasses.length) return;
        const classes = this.currentAppliedCssClasses;

        // contentEl
        const contentElWithRemove = this.contentEl as unknown as {
            removeClasses?: (classes: string[]) => void;
        };
        if (contentElWithRemove?.removeClasses) {
            try {
                contentElWithRemove.removeClasses(classes);
            } catch {
                classes.forEach((c) => this.contentEl.classList.remove(c));
            }
        } else {
            classes.forEach((c) => this.contentEl.classList.remove(c));
        }

        // workspace leaf container
        const leafContainer =
            ((this.leaf as unknown as { containerEl?: HTMLElement })
                ?.containerEl as HTMLElement | undefined) ??
            (this.contentEl?.closest('.workspace-leaf') as HTMLElement | null);

        if (leafContainer) {
            const leafWithRemove = leafContainer as unknown as {
                removeClasses?: (classes: string[]) => void;
            };
            if (leafWithRemove.removeClasses) {
                try {
                    leafWithRemove.removeClasses(classes);
                } catch {
                    classes.forEach((c) => leafContainer.classList.remove(c));
                }
            } else {
                classes.forEach((c) => leafContainer.classList.remove(c));
            }
        }

        this.currentAppliedCssClasses = [];
    }
}
