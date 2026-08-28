import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { Store } from 'src/lib/store/store';
import { defaultDocumentState } from 'src/stores/document/default-document-state';
import { documentReducer } from 'src/stores/document/document-reducer';
import { DocumentState } from 'src/stores/document/document-state-type';
import { DocumentStoreAction } from 'src/stores/document/document-store-actions';
import { attachBackgroundSaveSubscription } from './background-document-saver';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const noopError = () => {};

type FakePlugin = {
    app: {
        vault: { process: ReturnType<typeof vi.fn> };
        workspace: {
            getLeavesOfType: ReturnType<typeof vi.fn>;
        };
    };
};

const BODY = `<!--section: 1-->
Alpha

<!--section: 2-->
Beta
`;

const makeStore = () => {
    const store = new Store<DocumentState, DocumentStoreAction>(
        defaultDocumentState(),
        documentReducer,
        noopError,
    );
    store.dispatch({
        type: 'document/file/load-from-disk',
        payload: {
            document: { data: BODY, frontmatter: '', position: null },
            format: 'sections',
            activeSection: null,
        },
    });
    return store;
};

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

describe('background document saver', () => {
    let plugin: FakePlugin;

    beforeEach(() => {
        plugin = {
            app: {
                vault: { process: vi.fn().mockResolvedValue(undefined) },
                workspace: {
                    getLeavesOfType: vi.fn().mockReturnValue([]),
                },
            },
        };
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('writes edits to the vault when the file is not open in a lineage view', async () => {
        const store = makeStore();
        attachBackgroundSaveSubscription(
            plugin as never,
            { path: 'file.md' } as never,
            store,
            'sections',
        );
        const nodeId = store.getValue().sections.section_id['1'];
        store.dispatch({
            type: 'document/update-node-content',
            payload: { nodeId: nodeId!, content: "Alpha edited" },
            context: { isInSidebar: false },
        });
        await wait(400);
        expect(plugin.app.vault.process).toHaveBeenCalledTimes(1);
        const [, fn] = plugin.app.vault.process.mock.calls[0];
        expect(fn()).toContain('Alpha edited');
    });

    it('skips the write while the file is open in a lineage view', async () => {
        const store = makeStore();
        plugin.app.workspace.getLeavesOfType.mockReturnValue([
            { view: { file: { path: 'file.md' } } },
        ]);
        attachBackgroundSaveSubscription(
            plugin as never,
            { path: 'file.md' } as never,
            store,
            'sections',
        );
        const nodeId = store.getValue().sections.section_id['1'];
        store.dispatch({
            type: 'document/update-node-content',
            payload: { nodeId: nodeId!, content: "Alpha edited" },
            context: { isInSidebar: false },
        });
        await wait(400);
        expect(plugin.app.vault.process).not.toHaveBeenCalled();
    });

    it('only attaches once per store', async () => {
        const store = makeStore();
        attachBackgroundSaveSubscription(
            plugin as never,
            { path: 'file.md' } as never,
            store,
            'sections',
        );
        attachBackgroundSaveSubscription(
            plugin as never,
            { path: 'file.md' } as never,
            store,
            'sections',
        );
        const nodeId = store.getValue().sections.section_id['1'];
        store.dispatch({
            type: 'document/update-node-content',
            payload: { nodeId: nodeId!, content: "Alpha edited" },
            context: { isInSidebar: false },
        });
        await wait(400);
        expect(plugin.app.vault.process).toHaveBeenCalledTimes(1);
    });
});
