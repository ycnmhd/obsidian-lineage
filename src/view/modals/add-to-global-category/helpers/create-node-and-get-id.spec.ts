import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createNodeAndGetId } from 'src/view/modals/add-to-global-category/helpers/create-node-and-get-id';

type Ctx = {
    plugin: {
        settings: {
            dispatch: ReturnType<typeof vi.fn>;
            getValue: ReturnType<typeof vi.fn>;
        };
    };
};

// Build a fake plugin whose settings store already contains the node "after
// creation" (the reducer runs synchronously), so the helper's re-read finds it.
const makeCtx = (tree: unknown): Ctx => {
    const state = { categories: { tree } };
    return {
        plugin: {
            settings: {
                dispatch: vi.fn(),
                getValue: vi.fn(() => state),
            },
        },
    };
};

describe('createNodeAndGetId', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const dispatchRecord = (ctx: Ctx) =>
        ctx.plugin.settings.dispatch.mock.calls[0][0];

    it('creates a root-level folder and returns its id', () => {
        const ctx = makeCtx([
            { id: 'p1', name: 'Projects', type: 'folder', parentId: null, children: [] },
            { id: 'new-id', name: 'New Dir', type: 'folder', parentId: null, children: [] },
        ]);

        const id = createNodeAndGetId(ctx.plugin as never, 'New Dir', 'folder', null);

        expect(dispatchRecord(ctx)).toEqual({
            type: 'settings/categories/global/create-folder',
            payload: { parentId: null, name: 'New Dir' },
        });
        expect(id).toBe('new-id');
    });

    it('creates a category under a parent folder and returns its id', () => {
        const ctx = makeCtx([
            {
                id: 'parent',
                name: 'Projects',
                type: 'folder',
                parentId: null,
                children: [
                    { id: 'c1', name: 'Existing', type: 'category', parentId: 'parent', children: [] },
                    { id: 'new-cat', name: 'New Cat', type: 'category', parentId: 'parent', children: [] },
                ],
            },
        ]);

        const id = createNodeAndGetId(ctx.plugin as never, 'New Cat', 'category', 'parent');

        expect(dispatchRecord(ctx)).toEqual({
            type: 'settings/categories/global/create-category',
            payload: { parentId: 'parent', name: 'New Cat' },
        });
        expect(id).toBe('new-cat');
    });

    it('picks the newest matching node when duplicate names exist', () => {
        const ctx = makeCtx([
            { id: 'old-cat', name: 'Same', type: 'category', parentId: null, children: [] },
            { id: 'new-cat', name: 'Same', type: 'category', parentId: null, children: [] },
        ]);

        const id = createNodeAndGetId(ctx.plugin as never, 'Same', 'category', null);
        expect(id).toBe('new-cat');
    });

    it('returns null when the parent folder does not exist', () => {
        const ctx = makeCtx([]);
        const id = createNodeAndGetId(ctx.plugin as never, 'New Cat', 'category', 'missing');
        expect(id).toBeNull();
    });
});
