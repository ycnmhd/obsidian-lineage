import { Plugin, TFile, WorkspaceLeaf } from 'obsidian';
import { LINEAGE_VIEW_TYPE, LineageView } from './view/view';
import { createSetViewState } from 'src/obsidian/patches/create-set-view-state';
import { around } from 'monkey-around';
import { settingsReducer } from 'src/stores/settings/settings-reducer';
import { deepMerge } from 'src/helpers/deep-merge';
import { DEFAULT_SETTINGS } from 'src/stores/settings/default-settings';
import { Store } from 'src/lib/store/store';
import {
    DocumentsPreferences,
    Settings,
} from 'src/stores/settings/settings-type';
import { registerFileMenuEvent } from 'src/obsidian/events/workspace/register-file-menu-event';
import { addCommands } from 'src/obsidian/commands/add-commands';
import { settingsSubscriptions } from 'src/stores/settings/subscriptions/settings-subscriptions';
import { PluginState } from 'src/stores/plugin/plugin-state-type';
import { PluginStoreActions } from 'src/stores/plugin/plugin-store-actions';
import { pluginReducer } from 'src/stores/plugin/plugin-reducer';
import { DefaultPluginState } from 'src/stores/plugin/default-plugin-state';
import { StatusBar } from 'src/obsidian/status-bar/status-bar';
import { onPluginError } from 'src/lib/store/on-plugin-error';
import { customIcons, loadCustomIcons } from 'src/helpers/load-custom-icons';
import { setActiveLeaf } from 'src/obsidian/patches/set-active-leaf';
import { migrateSettings } from 'src/stores/settings/migrations/migrate-settings';
import { toggleFileViewType } from 'src/obsidian/events/workspace/effects/toggle-file-view-type';
import { toggleObsidianViewType } from 'src/obsidian/events/workspace/effects/toggle-obsidian-view-type';
import { getActiveFile } from 'src/obsidian/commands/helpers/get-active-file';
import { getLeafOfFile } from 'src/obsidian/events/workspace/helpers/get-leaf-of-file';
import { openFile } from 'src/obsidian/events/workspace/effects/open-file';
import { delay } from 'src/helpers/delay';
import { createLineageDocument } from 'src/obsidian/events/workspace/effects/create-lineage-document';
import { registerFilesMenuEvent } from 'src/obsidian/events/workspace/register-files-menu-event';
import { removeHtmlElementMarkerInPreviewMode } from 'src/obsidian/markdown-post-processors/remove-html-element-marker-in-preview-mode';
import {
    minimapWorker,
    rulesWorker,
    statusBarWorker,
} from 'src/workers/worker-instances';
import { onVaultEvent } from 'src/stores/plugin/subscriptions/on-vault-event';
import { onWorkspaceEvent } from 'src/stores/plugin/subscriptions/on-workspace-event';
import { SettingsActions } from 'src/stores/settings/settings-store-actions';
import {
    ExternalHighlight,
    registerHighlights,
    clearHighlights,
} from 'src/lib/highlight-registry';
import {
    GLOBAL_CATEGORIES_VIEW_TYPE,
    GlobalCategoriesView,
} from 'src/obsidian/views/global-categories-view';
import { openGlobalCategoriesView } from 'src/obsidian/events/workspace/effects/open-global-categories-view';
import { lang } from 'src/lang/lang';
import {
    ZEN_MODE_CLASS,
    subscribeZenModeToBody,
} from 'src/obsidian/zen/zen-mode';
import {
    LineageCardPopoverView,
    LINEAGE_CARD_POPOVER_VIEW_TYPE,
} from 'src/obsidian/views/card-popover-view';
import { getDocumentStoreForFile } from 'src/view/components/global-categories/helpers/document-store-manager';
import { DocumentState } from 'src/stores/document/document-state-type';

export type SettingsStore = Store<Settings, SettingsActions>;
export type PluginStore = Store<PluginState, PluginStoreActions>;

export default class Lineage extends Plugin {
    settings: SettingsStore;
    store: PluginStore;
    statusBar: StatusBar;
    private timeoutReferences: Set<ReturnType<typeof setTimeout>> = new Set();
    viewType: DocumentsPreferences = {};
    private zenModeSubscription: (() => void) | null = null;

    /**
     * Register highlights for a Lineage node.
     * Used by external plugins (e.g., SideNote) to highlight text in cards.
     *
     * @param nodeId - The Lineage node ID
     * @param highlights - Array of highlights to register
     */
    registerNodeHighlights(
        nodeId: string,
        highlights: ExternalHighlight[],
    ): void {
        registerHighlights(nodeId, highlights);
    }

    /**
     * Clear all highlights for a Lineage node.
     * Used by external plugins to remove highlights.
     *
     * @param nodeId - The Lineage node ID
     */
    clearNodeHighlights(nodeId: string): void {
        clearHighlights(nodeId);
    }

    /**
     * Returns true if the file at `path` is configured to open in a Lineage view.
     *
     * @param filepath - The path of the file to check
     */
    isLineageDocument(filepath: string): boolean {
        return (
            this.settings.getValue().documents[filepath]?.viewType === 'lineage'
        );
    }

    /**
     * Open the Lineage cards that contain `searchText` and focus the first
     * matching card.
     *
     * This is the public API used by external plugins (e.g. Advanced URI) to
     * deep-link into the cards that contain a given piece of text.
     *
     * If `filepath` is provided and is a Lineage document that is not yet open
     * in a Lineage view, it is opened in a Lineage view first.
     *
     * @param searchText - The text to search for in the cards
     * @param filepath - Optional path of the Lineage document to search
     * @returns The number of matching cards, or `-1` if the file is not a
     *          Lineage document (or no Lineage view is available).
     */
    async findAndOpenCards(
        searchText: string,
        filepath?: string,
    ): Promise<number> {
        if (filepath) {
            if (!this.isLineageDocument(filepath)) {
                return -1;
            }
            const file = this.app.vault.getAbstractFileByPath(filepath);
            if (!(file instanceof TFile)) {
                return -1;
            }

            const existingLeaf = getLeafOfFile(this, file, LINEAGE_VIEW_TYPE);
            if (!existingLeaf) {
                const markdownLeaf = getLeafOfFile(this, file, 'markdown');
                if (markdownLeaf) {
                    // Convert the markdown leaf into a Lineage view.
                    toggleObsidianViewType(this, markdownLeaf, 'lineage');
                } else {
                    const leaf = await openFile(this, file, 'tab');
                    toggleObsidianViewType(this, leaf, 'lineage');
                }
            }
        }

        const view = await this.waitForLineageView(filepath);
        if (!view) {
            return -1;
        }

        // Ensure the view's leaf is active and focused so align/scroll runs.
        try {
            this.app.workspace.setActiveLeaf(view.leaf, { focus: true });
        } catch (e) {
            // ignore: the leaf may already be detached
        }

        // When the file is freshly opened, the view's mount align
        // (view/life-cycle/mount, priority 100) is a SMOOTH scroll that runs
        // after our navigation and would override it. It also blocks our
        // set-active-node align (priority 90 < 100, so the align returns early
        // while the mount is still running). Wait for the mount scroll to
        // finish before navigating.
        await delay(500);

        const rawQuery = String(searchText ?? '');
        const query = this.normalizeSearchQuery(rawQuery);
        if (query.length === 0) return 0;

        // Dispatch through Lineage's own search action so matching cards get
        // highlighted and the first match activated (same as the built-in box).
        view.viewStore.dispatch({
            type: 'view/search/set-query',
            payload: { query },
        });
        const fuseCount = view.viewStore.getValue().search.results.size;
        let targetId: string | undefined;
        let resultCount = 0;
        if (fuseCount > 0) {
            // Fuse matched at least one card. Take the first match as the target
            // and still navigate + scroll to it (a bare return here leaves the
            // active node untouched and never scrolls, which is what happened
            // when the file was already open).
            targetId = Array.from(
                view.viewStore.getValue().search.results.keys(),
            )[0];
            resultCount = fuseCount;
        } else {
            // Fuse found nothing, so a search query is now active with an empty
            // result set. Lineage's UI filters out ALL cards in that state (see
            // group.svelte), which would keep the target card hidden even after we
            // navigate to it. Clear the query to reveal every card before we find
            // and navigate to the match ourselves.
            view.viewStore.dispatch({
                type: 'view/search/set-query',
                payload: { query: '' },
            });

            // The Fuse search uses exact whole-query matching by default (threshold
            // 0) and can miss chunk text that differs in casing, whitespace or
            // formatting. Fall back to a tolerant scan over the raw card content.
            const matches = this.findMatchingLineageNodeIds(
                view.documentStore.getValue(),
                query,
            );
            targetId = matches[0];
            resultCount = matches.length;
        }
        if (targetId) {
            // `openmode: 'window'` opens the file in a new window, which creates a
            // DUPLICATE Lineage leaf for the same file. `getActiveViewOfType` (used
            // by waitForLineageView) returns the globally-active leaf, which may be
            // the freshly-opened popout leaf that has NOT rendered its cards yet
            // (empty contentEl). Navigating that leaf is a no-op. So we navigate
            // EVERY Lineage leaf for the file that actually has the card rendered in
            // its own DOM - whichever one is visible to the user gets revealed.
            const allLeaves =
                this.app.workspace.getLeavesOfType(LINEAGE_VIEW_TYPE);
            const forFile = allLeaves.filter(
                (l) => (l.view as LineageView)?.file?.path === filepath,
            );
            for (const leaf of forFile) {
                const v = leaf.view as LineageView;
                // Clear any active search filter on THIS view so all cards are
                // revealed (an active query with empty results hides every card).
                v.viewStore.dispatch({
                    type: 'view/search/set-query',
                    payload: { query: '' },
                });
                // The viewStore context (the document the reducer uses to resolve
                // the active branch) can lag behind the documentStore after a
                // reload, because node IDs are regenerated. Sync it with the
                // current document first so navigation uses the same columns we
                // matched against - otherwise updateActiveBranch throws
                // "could not find group for node".
                v.viewStore.setContext(v.documentStore.getValue().document);
                v.viewStore.dispatch({
                    type: 'view/set-active-node/mouse',
                    payload: { id: targetId },
                });
                this.scrollCardIntoView(v, targetId);
            }
        }
        return resultCount;
    }

    /**
     * Guaranteed scroll of the card into view. Lineage cards render with an
     * id equal to the node id, so we can scroll the DOM element directly
     * (this scrolls every scrollable ancestor) rather than relying solely on
     * the align-branch effect.
     */
    private scrollCardIntoView(view: LineageView, nodeId: string): void {
        const tryScroll = (): boolean => {
            const el = this.findCardElement(view, nodeId);
            if (!el) {
                return false;
            }
            // The card is in the DOM, but its window may not be focused yet.
            // `openmode: 'window'` opens a popout that is NOT focused when this
            // runs; scrolling it before it is focused has no visible effect (the
            // scroll is "swallowed" by the time it takes the window to open).
            // So wait until the card's own window is focused before scrolling.
            const focused = el.ownerDocument.hasFocus();
            if (!focused) {
                return false;
            }
            this.performScroll(view, el);
            return true;
        };
        if (!tryScroll()) {
            // The card may not be rendered yet (Svelte needs to update after the
            // reducer state change) and/or its window may not be focused yet
            // (openmode=window opens a popout). Retry until both are true.
            let attempts = 0;
            const interval = window.setInterval(() => {
                if (tryScroll() || ++attempts > 40) {
                    window.clearInterval(interval);
                }
            }, 150);
            window.setTimeout(() => window.clearInterval(interval), 6000);
        }
    }

    /**
     * Actually scrolls the card element into view. Must only be called once the
     * card is in the DOM AND its window is focused (see scrollCardIntoView).
     */
    private performScroll(view: LineageView, el: HTMLElement): void {
        // Scroll every scrollable ancestor so the card is centered.
        //
        // IMPORTANT 1: the card (and its scroll containers) may live in a
        // DIFFERENT window than the one this code runs in (openmode=window
        // opens a popout). So every DOM API here must use the element's OWN
        // window/document, not the current window's.
        //
        // IMPORTANT 2: Lineage applies transform: scale(zoom) to .columns.
        // getBoundingClientRect returns SCREEN pixels (post-transform), but
        // scrollTop is in LAYOUT pixels. So the scroll delta must be divided
        // by the zoom level (exactly what Lineage's own alignVertically does:
        // column.scrollBy({ top: (scrollTop * -1) / zoomLevel })). Without
        // this, the scroll lands in the wrong place whenever zoom != 1.
        const elDoc = el.ownerDocument;
        const elWin = elDoc.defaultView as Window;
        const zoom = view.plugin.settings.getValue().view.zoomLevel || 1;
        const cardRectBefore = el.getBoundingClientRect();
        let node: HTMLElement | null = el.parentElement;
        while (node && node !== elDoc.body) {
            const style = elWin.getComputedStyle(node);
            const overflowY = style.overflowY;
            const overflowX = style.overflowX;
            const scrollable =
                (overflowY === 'auto' || overflowY === 'scroll') &&
                node.scrollHeight > node.clientHeight + 1;
            const scrollableX =
                (overflowX === 'auto' || overflowX === 'scroll') &&
                node.scrollWidth > node.clientWidth + 1;
            if (scrollable || scrollableX) {
                const contRect = node.getBoundingClientRect();
                if (scrollable) {
                    node.scrollTop += Math.round(
                        (cardRectBefore.top -
                            contRect.top -
                            (contRect.height - cardRectBefore.height) / 2) /
                            zoom,
                    );
                }
                if (scrollableX) {
                    node.scrollLeft += Math.round(
                        (cardRectBefore.left -
                            contRect.left -
                            (contRect.width - cardRectBefore.width) / 2) /
                            zoom,
                    );
                }
            }
            node = node.parentElement;
        }
        // Re-trigger Lineage's own align (centers the active node using its own
        // zoom-aware logic) as a backup / to also scroll sibling columns.
        view.alignBranch.align({ type: 'view/align-branch/center-node' });
    }

    /**
     * Finds the card DOM element for `nodeId`, searching the correct window's
     * document (the view may live in a popout window opened via openmode=window)
     * and all candidate roots (container, containerEl, contentEl).
     */
    private findCardElement(
        view: LineageView,
        nodeId: string,
    ): HTMLElement | null {
        const doc = view.containerEl?.ownerDocument ?? window.document;
        const roots: (HTMLElement | null)[] = [
            view.container,
            view.containerEl,
            (view as unknown as { contentEl?: HTMLElement }).contentEl ?? null,
            doc.querySelector('.lineage-view') as HTMLElement | null,
        ];
        for (const root of roots) {
            if (!root) continue;
            const el = root.querySelector(
                `#${CSS.escape(nodeId)}`,
            ) as HTMLElement | null;
            if (el) return el;
        }
        return doc.getElementById(nodeId) as HTMLElement | null;
    }

    /**
     * Collapses all whitespace to single spaces and trims, so that extra
     * newlines/indentation in a pasted chunk do not break matching.
     */
    private normalizeSearchQuery(query: string): string {
        return query.replace(/\s+/g, ' ').trim();
    }

    /**
     * Open the card of `file` referenced by an Obsidian link subpath
     * (`"#^blockid"` or `"#Heading"`) inside `leaf` — typically the leaf of
     * a hover popover (Hover Editor). Only that ONE card is rendered, using
     * the same card view as the global categories view; it is fully editable
     * and changes are saved back to the file.
     *
     * Public API for external plugins. Duck-type this method before calling
     * it, and fall back to standard Obsidian navigation when it resolves to
     * `false`.
     *
     * @returns `true` when the card view was opened, `false` when the file is
     *          not a Lineage document or the subpath could not be resolved to
     *          a card (the caller should fall back).
     */
    async openCardPopover(
        leaf: WorkspaceLeaf,
        file: TFile,
        subpath?: string,
    ): Promise<boolean> {
        if (!subpath || file.extension !== 'md') return false;
        if (!this.isLineageDocument(file.path)) return false;

        // Reuses the store of an already open Lineage view (live-sync) or a
        // lazily created background store that persists edits to disk.
        const { documentStore } = await getDocumentStoreForFile(this, file);
        const documentState = documentStore.getValue();
        if (Object.keys(documentState.document.content).length === 0) {
            return false;
        }

        const nodeId = this.resolveSubpathToNodeId(documentState, subpath);
        if (!nodeId) return false;

        await leaf.setViewState({ type: LINEAGE_CARD_POPOVER_VIEW_TYPE });
        const view = leaf.view;
        if (!(view instanceof LineageCardPopoverView)) return false;
        await view.showCard(file, nodeId);
        return true;
    }

    /**
     * Resolve an Obsidian link subpath to the Lineage card containing it.
     *
     * Supported subpaths:
     * - `"#^blockid"` — block references created with Lineage's "Copy link to
     *   block": the id is appended to the card's last content line, so a
     *   word-bounded match of the `^id` token identifies the card precisely.
     * - `"#Heading"` / `"#Parent#Child"` — resolved with the same tolerant
     *   text search over the card contents that `findAndOpenCards` uses
     *   (Lineage sections are tree indexes, not markdown headings).
     *
     * @returns the node id, or `null` when nothing matches.
     */
    private resolveSubpathToNodeId(
        documentState: DocumentState,
        subpath: string,
    ): string | null {
        if (!subpath) return null;

        const blockId = /^#?\^([a-zA-Z0-9-]+)/.exec(subpath)?.[1];
        if (blockId) {
            const escaped = blockId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const token = new RegExp(`(^|\\s)\\^${escaped}(\\s|$)`);
            for (const nodeId of this.getValidNodeIds(documentState)) {
                const content = documentState.document.content[nodeId]?.content;
                if (content && token.test(content)) return nodeId;
            }
            return null;
        }

        // heading-style subpath: match the last segment against card contents
        const heading = subpath.replace(/^#+/, '').split('#').pop()?.trim();
        if (!heading) return null;
        const matches = this.findMatchingLineageNodeIds(documentState, heading);
        return matches[0] ?? null;
    }

    /** Node ids that are actually part of the live column tree. */
    private getValidNodeIds(documentState: DocumentState): string[] {
        const validIds: string[] = [];
        for (const column of documentState.document.columns) {
            for (const group of column.groups) {
                for (const nodeId of group.nodes) validIds.push(nodeId);
            }
        }
        return validIds;
    }

    /**
     * Tolerant search for cards containing `query`, handling the case where the
     * query is a longer chunk that does not appear verbatim (as a single exact
     * substring) in any card.
     *
     * Only nodes that exist in the live column tree are considered - stale
     * node IDs left in `document.content` but absent from `columns` are
     * skipped, because navigating to them makes the reducer throw
     * "could not find group for node".
     *
     * 1. Whole-phrase match (case-insensitive, whitespace-normalized).
     * 2. Fallback: score each card by how many of the query's words it contains
     *    and return the best-scoring cards (covers chunks spanning cards).
     */
    private findMatchingLineageNodeIds(
        documentState: DocumentState,
        query: string,
    ): string[] {
        const validIds = this.getValidNodeIds(documentState);

        const content = documentState.document.content;
        const normalizedQuery = this.normalizeSearchQuery(query).toLowerCase();
        const wholePhraseMatches: string[] = [];
        for (const nodeId of validIds) {
            const cardContent = this.normalizeSearchQuery(
                content[nodeId]?.content ?? '',
            ).toLowerCase();
            if (cardContent.includes(normalizedQuery)) {
                wholePhraseMatches.push(nodeId);
            }
        }
        if (wholePhraseMatches.length > 0) return wholePhraseMatches;

        const tokens = normalizedQuery.split(' ').filter((t) => t.length >= 3);
        if (tokens.length === 0) return [];

        const scored: { id: string; score: number }[] = [];
        for (const nodeId of validIds) {
            const cardContent = this.normalizeSearchQuery(
                content[nodeId]?.content ?? '',
            ).toLowerCase();
            let score = 0;
            for (const token of tokens) {
                if (cardContent.includes(token)) score++;
            }
            if (score > 0) scored.push({ id: nodeId, score });
        }
        if (scored.length === 0) return [];
        scored.sort((a, b) => b.score - a.score);
        const topScore = scored[0].score;
        const top = scored.filter((s) => s.score === topScore).map((s) => s.id);
        return top;
    }

    /**
     * Waits until the active LineageView has loaded the document at `filepath`
     * (or the active view document when `filepath` is omitted).
     */
    private async waitForLineageView(
        filepath?: string,
    ): Promise<LineageView | null> {
        const deadline = Date.now() + 3000;
        let view = this.app.workspace.getActiveViewOfType(LineageView);
        while (Date.now() < deadline) {
            view = this.app.workspace.getActiveViewOfType(LineageView);
            if (view && view.file) {
                const matchesPath = !filepath || view.file.path === filepath;
                const hasContent =
                    Object.keys(view.documentStore.getValue().document.content)
                        .length > 0;
                const hasContainer = !!view.container;
                if (matchesPath && hasContent && hasContainer) return view;
            }
            await delay(25);
        }
        return view;
    }

    async onload() {
        await this.loadSettings();
        this.store = new Store<PluginState, PluginStoreActions>(
            DefaultPluginState(),
            pluginReducer,
            onPluginError,
        );
        loadCustomIcons();
        this.registerView(
            LINEAGE_VIEW_TYPE,
            (leaf) => new LineageView(leaf, this),
        );
        this.registerView(
            GLOBAL_CATEGORIES_VIEW_TYPE,
            (leaf) => new GlobalCategoriesView(leaf, this),
        );
        this.registerView(
            LINEAGE_CARD_POPOVER_VIEW_TYPE,
            (leaf) => new LineageCardPopoverView(leaf, this),
        );
        addCommands(this);
        this.registerPatches();
        this.registerEvents();
        this.statusBar = new StatusBar(this);
        this.loadRibbonIcon();
        this.registerMarkdownPostProcessor(
            removeHtmlElementMarkerInPreviewMode,
        );
        // Global zen mode: hide Obsidian's native chrome (tabs, ribbon,
        // sidebars, status bar, titlebar buttons) while on. Managed here so it
        // is independent of any single Lineage view being open.
        this.zenModeSubscription = subscribeZenModeToBody(this);
    }

    async saveSettings() {
        await this.saveData(this.settings.getValue());
    }

    async loadSettings() {
        const rawSettings = (await this.loadData()) || {};
        const settings = deepMerge(rawSettings, DEFAULT_SETTINGS());
        migrateSettings(settings);
        this.settings = new Store<Settings, SettingsActions>(
            settings,
            settingsReducer,
            onPluginError,
        );
        this.settings.subscribe(() => {
            this.saveSettings();
        });
        settingsSubscriptions(this);
    }

    private registerEvents() {
        registerFileMenuEvent(this);
        registerFilesMenuEvent(this);
        onVaultEvent(this);
        onWorkspaceEvent(this);
    }

    registerTimeout(timeout: ReturnType<typeof setTimeout>) {
        this.timeoutReferences.add(timeout);
    }

    private registerPatches() {
        this.register(around(this.app.workspace, { setActiveLeaf }));
        const setViewState = createSetViewState(this);
        // @ts-ignore
        this.register(around(WorkspaceLeaf.prototype, { setViewState }));
    }

    private loadRibbonIcon() {
        this.addRibbonIcon(
            customIcons.cards.name,
            'Toggle Lineage view',
            () => {
                const file = getActiveFile(this);
                if (file) toggleFileViewType(this, file, undefined);
                else createLineageDocument(this);
            },
        );
        this.addRibbonIcon(
            customIcons.folderTree.name,
            lang.global_categories_view_title,
            () => {
                openGlobalCategoriesView(this);
            },
        );
    }

    onunload() {
        super.onunload();
        if (this.zenModeSubscription) {
            this.zenModeSubscription();
            this.zenModeSubscription = null;
        }
        document.body.removeClass(ZEN_MODE_CLASS);
        for (const timeout of this.timeoutReferences) {
            clearTimeout(timeout);
        }
        minimapWorker.terminate();
        rulesWorker.terminate();
        statusBarWorker.terminate();
    }
}
