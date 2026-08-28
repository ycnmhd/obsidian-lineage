import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
    resolveAddTarget,
    addCardToGlobalCategory,
    AddTarget,
} from 'src/obsidian/commands/helpers/add-card-to-global-category';

// Mock the view-resolution helpers so we can test each focus scenario.
const mocks = vi.hoisted(() => ({
    getActiveLineageView: vi.fn(),
    isSidebarActive: vi.fn(),
    getActiveGlobalCardContext: vi.fn(),
}));

vi.mock('src/obsidian/commands/helpers/get-active-lineage-view', () => ({
    getActiveLineageView: mocks.getActiveLineageView,
}));
vi.mock(
    'src/view/actions/keyboard-shortcuts/helpers/commands/commands/helpers/sidebar-navigation',
    () => ({ isSidebarActive: mocks.isSidebarActive }),
);
vi.mock(
    'src/view/components/global-categories/helpers/global-view-keyboard',
    () => ({ getActiveGlobalCardContext: mocks.getActiveGlobalCardContext }),
);

const filePath = 'folder/note.md';
const section = '2';
const nodeId = 'node-1';

const makeLineageView = (pinnedIds: string[] = []) => {
    const documentState = {
        sections: { id_section: { [nodeId]: section, other: '1' } },
        pinnedNodes: { Ids: pinnedIds, nodeToCategory: {} },
    };
    const documentStore = {
        getValue: () => documentState,
        dispatch: vi.fn(),
    };
    const view = {
        file: { path: filePath },
        viewStore: {
            getValue: (): {
                pinnedNodes: { activeNode: string | null };
                document: { activeNode: string | null };
            } => ({
                pinnedNodes: { activeNode: nodeId },
                document: { activeNode: nodeId },
            }),
        },
        documentStore,
        plugin: { settings: { dispatch: vi.fn() } },
    };
    return view;
};

describe('resolveAddTarget', () => {
    beforeEach(() => {
        mocks.getActiveLineageView.mockReset();
        mocks.isSidebarActive.mockReset();
        mocks.getActiveGlobalCardContext.mockReset();
    });

    it('returns the active document node in the main Lineage view', () => {
        const view = makeLineageView();
        mocks.getActiveLineageView.mockReturnValue(view);
        mocks.isSidebarActive.mockReturnValue(false);

        const target = resolveAddTarget(view.plugin as never);
        expect(target).toEqual({
            filePath,
            section: '2',
            nodeId,
            lineageView: view,
        });
    });

    it('returns the active sidebar pinned node when the sidebar is focused', () => {
        const view = makeLineageView();
        mocks.getActiveLineageView.mockReturnValue(view);
        mocks.isSidebarActive.mockReturnValue(true);

        const target = resolveAddTarget(view.plugin as never);
        expect(target?.nodeId).toBe(nodeId);
        expect(target?.section).toBe('2');
    });

    it('returns null when the Lineage view has no active node', () => {
        const view = makeLineageView();
        view.viewStore.getValue = vi.fn(() => ({
            pinnedNodes: { activeNode: null },
            document: { activeNode: null },
        }));
        mocks.getActiveLineageView.mockReturnValue(view);
        mocks.isSidebarActive.mockReturnValue(false);

        const target = resolveAddTarget(view.plugin as never);
        expect(target).toBeNull();
    });

    it('falls back to the selected card in the global categories view', () => {
        mocks.getActiveLineageView.mockReturnValue(null);
        const virtualView = { file: { path: filePath } };
        mocks.getActiveGlobalCardContext.mockReturnValue({
            card: { filePath, section, nodeId, categoryId: 'c1' },
            virtualView,
        });

        const target = resolveAddTarget({} as never);
        expect(target).toEqual({
            filePath,
            section,
            nodeId,
            lineageView: virtualView,
        });
    });

    it('returns null when no target card can be found', () => {
        mocks.getActiveLineageView.mockReturnValue(null);
        mocks.getActiveGlobalCardContext.mockReturnValue(null);

        const target = resolveAddTarget({} as never);
        expect(target).toBeNull();
    });
});

describe('addCardToGlobalCategory', () => {
    it('adds the card and records the category when the node is pinned', () => {
        const view = makeLineageView([nodeId]);
        const settingsDispatch = vi.fn();
        const plugin = {
            settings: { dispatch: settingsDispatch },
        };
        const target: AddTarget = {
            filePath,
            section,
            nodeId,
            lineageView: view as never,
        };

        addCardToGlobalCategory(plugin as never, target, 'category-9');

        expect(settingsDispatch).toHaveBeenCalledWith({
            type: 'settings/categories/global/add-card',
            payload: { categoryId: 'category-9', filePath, section },
        });
        expect(view.documentStore.dispatch).toHaveBeenCalledWith({
            type: 'document/pinned-nodes/set-category',
            payload: { id: nodeId, category: 'global:category-9' },
        });
    });

    it('only adds the card when the node is not pinned', () => {
        const view = makeLineageView([]);
        const plugin = { settings: { dispatch: vi.fn() } };
        const target: AddTarget = {
            filePath,
            section,
            nodeId,
            lineageView: view as never,
        };

        addCardToGlobalCategory(plugin as never, target, 'category-9');

        expect(view.documentStore.dispatch).not.toHaveBeenCalled();
    });
});
