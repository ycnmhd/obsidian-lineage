import type Lineage from 'src/main';
import type { TFile } from 'obsidian';
import { Store } from 'src/lib/store/store';
import { DocumentState } from 'src/stores/document/document-state-type';
import { DocumentStoreAction } from 'src/stores/document/document-store-actions';
import { defaultDocumentState } from 'src/stores/document/default-document-state';
import { documentReducer } from 'src/stores/document/document-reducer';
import { onPluginError } from 'src/lib/store/on-plugin-error';
import { extractFrontmatter } from 'src/view/helpers/extract-frontmatter';
import { detectDocumentFormat } from 'src/lib/format-detection/detect-document-format';
import { LineageDocumentFormat } from 'src/stores/settings/settings-type';
import { setDocumentFormat } from 'src/stores/settings/actions/set-document-format';
import {
    attachBackgroundSaveSubscription,
    BACKGROUND_VIEW_ID,
} from './background-document-saver';

export type DocumentStoreInfo = {
    documentStore: Store<DocumentState, DocumentStoreAction>;
    format: LineageDocumentFormat;
};

const backgroundStores = new Map<string, Promise<DocumentStoreInfo>>();

export const getOrDetectFormat = (
    plugin: Lineage,
    path: string,
    body?: string,
) => {
    const persisted = plugin.settings.getValue().documents[path]
        ?.documentFormat;
    if (persisted) return persisted;
    const format =
        (body ? detectDocumentFormat(body) : undefined) ||
        plugin.settings.getValue().general.defaultDocumentFormat;
    setDocumentFormat(plugin, path, format);
    return format;
};

/**
 * Get (or lazily create) a document store for a file so cards from any file
 * can be rendered and edited in the global categories view.
 *
 * - Files already open in a Lineage view share their existing store (edits
 *   live-sync with the open view).
 * - Previously opened files whose store is still registered are reused. Their
 *   save subscriptions were disposed when the view closed, so a background
 *   save subscription is attached here to persist edits made from the global
 *   view (it skips while the file is open in a Lineage view).
 * - Otherwise the file is read from the vault and parsed into a background
 *   store that is registered in `plugin.store` (so opening the file later
 *   reuses it) and saved back to disk on content changes.
 */
export const getDocumentStoreForFile = async (
    plugin: Lineage,
    file: TFile,
): Promise<DocumentStoreInfo> => {
    const existing = plugin.store.getValue().documents[file.path];
    if (existing) {
        const format = getOrDetectFormat(plugin, file.path);
        attachBackgroundSaveSubscription(
            plugin,
            file,
            existing.documentStore,
            format,
        );
        return {
            documentStore: existing.documentStore,
            format,
        };
    }

    const cached = backgroundStores.get(file.path);
    if (cached) return cached;

    const promise = (async () => {
        const data = await plugin.app.vault.read(file);
        const { body, frontmatter } = extractFrontmatter(data);
        const format = getOrDetectFormat(plugin, file.path, body);

        const documentStore = new Store<DocumentState, DocumentStoreAction>(
            defaultDocumentState(),
            documentReducer,
            onPluginError,
        );
        documentStore.dispatch({
            type: 'document/file/load-from-disk',
            payload: {
                document: { data: body, frontmatter, position: null },
                format,
                activeSection: null,
            },
        });

        plugin.store.dispatch({
            type: 'plugin/documents/register-new-document-store',
            payload: {
                path: file.path,
                documentStore,
                viewId: BACKGROUND_VIEW_ID,
            },
        });

        attachBackgroundSaveSubscription(plugin, file, documentStore, format);

        return { documentStore, format };
    })();
    backgroundStores.set(file.path, promise);
    return promise;
};
