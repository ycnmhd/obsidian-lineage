import { Store } from 'src/lib/store/store';
import { DocumentState } from 'src/stores/document/document-state-type';
import { DocumentStoreAction } from 'src/stores/document/document-store-actions';
import { stringifyDocument } from 'src/view/helpers/stringify-document';
import { LineageDocumentFormat } from 'src/stores/settings/settings-type';
import type Lineage from 'src/main';
import type { TFile } from 'obsidian';

/** viewId used when registering background stores created by the global view */
export const BACKGROUND_VIEW_ID = 'lineage-global-categories-background';

// mirrors LINEAGE_VIEW_TYPE in src/view/view.ts (kept here so this module has
// no runtime dependency on the view class, which drags in obsidian + workers)
const LINEAGE_VIEW_TYPE = 'lineage';

let saveTimeout: ReturnType<typeof setTimeout> | null = null;
const pendingSaves = new Map<string, () => Promise<void>>();
const attachedStores = new WeakSet<Store<DocumentState, DocumentStoreAction>>();

const isOpenInLineageView = (plugin: Lineage, path: string) => {
    return plugin.app.workspace
        .getLeavesOfType(LINEAGE_VIEW_TYPE)
        .some(
            (leaf) =>
                (leaf.view as { file?: { path?: string } }).file?.path ===
                path,
        );
};

/**
 * Persists content changes of a document store to the vault. Attached to
 * every store the global categories view edits — both freshly created
 * background stores and stores previously opened in a Lineage view (whose own
 * save subscriptions are disposed when the view closes).
 *
 * Writes are skipped while the file is open in a Lineage view (its own
 * `saveDocument` handles persistence) to avoid redundant writes.
 */
export const attachBackgroundSaveSubscription = (
    plugin: Lineage,
    file: TFile,
    documentStore: Store<DocumentState, DocumentStoreAction>,
    format: LineageDocumentFormat,
) => {
    if (attachedStores.has(documentStore)) return;
    attachedStores.add(documentStore);

    documentStore.subscribe((state, _action, firstRun) => {
        // don't rewrite the file on the initial subscription emission
        if (firstRun) return;
        pendingSaves.set(file.path, async () => {
            const data =
                state.file.frontmatter +
                stringifyDocument(state.document, format);
            if (data.trim().length === 0) return;
            if (isOpenInLineageView(plugin, file.path)) return;
            await plugin.app.vault.process(file, () => data);
        });
        if (saveTimeout) clearTimeout(saveTimeout);
        saveTimeout = setTimeout(async () => {
            const entries = Array.from(pendingSaves.entries());
            pendingSaves.clear();
            for (const [, save] of entries) {
                try {
                    await save();
                } catch (e) {
                    // eslint-disable-next-line no-console
                    console.error(
                        '[lineage] global categories save failed',
                        e,
                    );
                }
            }
        }, 300);
    });
};
