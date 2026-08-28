import { beforeEach, describe, expect, it } from 'vitest';
import {
    getActiveGlobalCardContext,
    globalCardListStore,
    globalViewStore,
    globalVirtualViewsStore,
    registerVirtualView,
    routeGlobalCommand,
    jumpToSearchResult,
} from 'src/view/components/global-categories/helpers/global-view-keyboard';
import { ViewStore } from 'src/view/view';
import type { VirtualLineageView } from 'src/view/components/global-categories/helpers/create-virtual-view';

const fakeEvent = () => ({ preventDefault: () => {} }) as KeyboardEvent;

type FakeEditing = {
    activeNodeId: string;
    isInSidebar: boolean;
};

type FakeState = {
    pinnedNodes: { activeNode: string };
    recentNodes: { activeNode: string };
    document: {
        editing: FakeEditing;
    };
    search: {
        query: string;
        results: Map<string, unknown>;
        fuzzySearch: boolean;
        showInput: boolean;
        showAllNodes: boolean;
        searching: boolean;
    };
};

const makeViewStore = () => {
    const state: FakeState = {
        pinnedNodes: { activeNode: '' },
        recentNodes: { activeNode: '' },
        document: {
            editing: { activeNodeId: '', isInSidebar: false },
        },
        search: {
            query: '',
            results: new Map(),
            fuzzySearch: false,
            showInput: false,
            showAllNodes: true,
            searching: false,
        },
    };
    const store = {
        getValue: () => state,
        dispatch: (action: {
            type: string;
            payload?: { id: string };
        }) => {
            if (action.type === 'view/pinned-nodes/set-active-node') {
                state.pinnedNodes.activeNode = action.payload!.id;
            }
            if (action.type === 'view/recent-nodes/set-active-node') {
                state.recentNodes.activeNode = action.payload!.id;
            }
            if (action.type === 'view/editor/enable-sidebar-editor') {
                state.document.editing = {
                    activeNodeId: action.payload!.id,
                    isInSidebar: true,
                };
            }
            if (action.type === 'view/editor/disable-sidebar-editor') {
                state.document.editing = {
                    activeNodeId: '',
                    isInSidebar: false,
                };
            }
        },
    };
    return store as unknown as ViewStore;
};

const getActive = (viewStore: ViewStore) =>
    (
        viewStore.getValue() as unknown as FakeState
    ).pinnedNodes.activeNode;

const getEditing = (viewStore: ViewStore) =>
    (viewStore.getValue() as unknown as FakeState).document.editing;

describe('global view keyboard navigation', () => {
    // container is only used for scrollIntoView lookups — a stub suffices
    const container = {
        querySelector: () => null,
    } as unknown as HTMLElement;
    let viewStore: ViewStore;

    beforeEach(() => {
        viewStore = makeViewStore();
        globalVirtualViewsStore.set({});
        globalCardListStore.set([
            { filePath: 'a.md', nodeId: 'n1', section: '1', categoryId: 'c1' },
            { filePath: 'a.md', nodeId: 'n2', section: '2', categoryId: 'c1' },
            { filePath: 'b.md', nodeId: 'n3', section: '1', categoryId: 'c1' },
            { filePath: 'b.md', nodeId: 'n4', section: '2', categoryId: 'c1' },
        ]);
    });

    it('moves down/up through the whole list', () => {
        routeGlobalCommand('go_down', fakeEvent(), container, { viewStore });
        expect(getActive(viewStore)).toBe('n1');
        routeGlobalCommand('go_down', fakeEvent(), container, { viewStore });
        expect(getActive(viewStore)).toBe('n2');
        routeGlobalCommand('go_down', fakeEvent(), container, { viewStore });
        expect(getActive(viewStore)).toBe('n3');
        routeGlobalCommand('go_up', fakeEvent(), container, { viewStore });
        expect(getActive(viewStore)).toBe('n2');
    });

    it('clamps at the list edges', () => {
        routeGlobalCommand('go_to_end_of_column', fakeEvent(), container, {
            viewStore,
        });
        expect(getActive(viewStore)).toBe('n4');
        routeGlobalCommand('go_down', fakeEvent(), container, { viewStore });
        expect(getActive(viewStore)).toBe('n4');
        routeGlobalCommand('go_to_beginning_of_column', fakeEvent(), container, {
            viewStore,
        });
        expect(getActive(viewStore)).toBe('n1');
        routeGlobalCommand('go_up', fakeEvent(), container, { viewStore });
        expect(getActive(viewStore)).toBe('n1');
    });

    it('supports navigate_to_next/previous_node aliases', () => {
        routeGlobalCommand('navigate_to_next_node', fakeEvent(), container, {
            viewStore,
        });
        expect(getActive(viewStore)).toBe('n1');
        routeGlobalCommand('navigate_to_next_node', fakeEvent(), container, {
            viewStore,
        });
        expect(getActive(viewStore)).toBe('n2');
        routeGlobalCommand('navigate_to_previous_node', fakeEvent(), container, {
            viewStore,
        });
        expect(getActive(viewStore)).toBe('n1');
    });

    it('moves between file groups with go_left/go_right', () => {
        routeGlobalCommand('go_down', fakeEvent(), container, { viewStore });
        routeGlobalCommand('go_down', fakeEvent(), container, { viewStore });
        expect(getActive(viewStore)).toBe('n2');
        routeGlobalCommand('go_right', fakeEvent(), container, { viewStore });
        expect(getActive(viewStore)).toBe('n3');
        routeGlobalCommand('go_left', fakeEvent(), container, { viewStore });
        expect(getActive(viewStore)).toBe('n1');
    });

    it('jumps to group edges with PageUp/PageDown', () => {
        routeGlobalCommand('go_to_beginning_of_group', fakeEvent(), container, {
            viewStore,
        });
        expect(getActive(viewStore)).toBe('n1');
        routeGlobalCommand('go_down', fakeEvent(), container, { viewStore });
        routeGlobalCommand('go_down', fakeEvent(), container, { viewStore });
        routeGlobalCommand('go_down', fakeEvent(), container, { viewStore });
        // active n4 (last of second group)
        routeGlobalCommand('go_to_end_of_group', fakeEvent(), container, {
            viewStore,
        });
        expect(getActive(viewStore)).toBe('n4');
        routeGlobalCommand('go_to_beginning_of_group', fakeEvent(), container, {
            viewStore,
        });
        expect(getActive(viewStore)).toBe('n3');
    });

    it('ignores unknown commands', () => {
        routeGlobalCommand('copy_active_card', fakeEvent(), container, {
            viewStore,
        });
        expect(getActive(viewStore)).toBe('');
    });

    it('enables edit mode on the active card (Enter)', () => {
        globalCardListStore.set([
            { filePath: 'a.md', nodeId: 'n1', section: '1', categoryId: 'c1' },
        ]);
        registerVirtualView(
            'a.md',
            {
                inlineEditor: {},
            } as unknown as VirtualLineageView,
        );
        routeGlobalCommand('go_down', fakeEvent(), container, { viewStore });
        routeGlobalCommand('enable_edit_mode', fakeEvent(), container, {
            viewStore,
        });
        const editing = getEditing(viewStore);
        expect(editing.activeNodeId).toBe('n1');
        expect(editing.isInSidebar).toBe(true);
    });

    it('saves and exits the card (Mod+Shift+Enter)', () => {
        globalCardListStore.set([
            { filePath: 'a.md', nodeId: 'n1', section: '1', categoryId: 'c1' },
        ]);
        let unloaded = false;
        registerVirtualView(
            'a.md',
            {
                inlineEditor: {
                    nodeId: 'n1',
                    unloadNode: () => {
                        unloaded = true;
                    },
                },
                viewStore,
            } as unknown as VirtualLineageView,
        );
        // simulate an active inline edit
        (
            viewStore.getValue() as unknown as FakeState
        ).document.editing = { activeNodeId: 'n1', isInSidebar: true };
        routeGlobalCommand('go_down', fakeEvent(), container, { viewStore });
        routeGlobalCommand('save_changes_and_exit_card', fakeEvent(), container, {
            viewStore,
        });
        expect(unloaded).toBe(true);
        expect(getEditing(viewStore).activeNodeId).toBe('');
    });

    it('moves the active card down/up with move_node_down/up', () => {
        globalCardListStore.set([
            { filePath: 'a.md', nodeId: 'n1', section: '1', categoryId: 'cat1' },
            { filePath: 'a.md', nodeId: 'n2', section: '2', categoryId: 'cat1' },
        ]);
        type StoredCard = { filePath: string; section: string };
        const globalCards: Record<string, StoredCard[]> = {
            cat1: [
                { filePath: 'a.md', section: '1' },
                { filePath: 'a.md', section: '2' },
            ],
        };
        const settingsStore = {
            getValue: () => ({ categories: { globalCards } }),
            dispatch: (action: {
                type: string;
                payload: {
                    categoryId: string;
                    filePath: string;
                    section: string;
                    toIndex: number;
                };
            }) => {
                if (action.type !== 'settings/categories/global/move-card') {
                    return;
                }
                const { categoryId, filePath, section, toIndex } =
                    action.payload;
                const list = globalCards[categoryId];
                const from = list.findIndex(
                    (c) => c.filePath === filePath && c.section === section,
                );
                if (from === -1) return;
                const [card] = list.splice(from, 1);
                list.splice(toIndex, 0, card);
            },
        };
        registerVirtualView(
            'a.md',
            { plugin: { settings: settingsStore } } as unknown as VirtualLineageView,
        );

        // activate the first card, then move it down
        routeGlobalCommand('go_down', fakeEvent(), container, { viewStore });
        expect(getActive(viewStore)).toBe('n1');
        routeGlobalCommand('move_node_down', fakeEvent(), container, {
            viewStore,
        });
        expect(globalCards['cat1'].map((c) => c.section)).toEqual([
            '2',
            '1',
        ]);

        // move it back up
        routeGlobalCommand('move_node_up', fakeEvent(), container, {
            viewStore,
        });
        expect(globalCards['cat1'].map((c) => c.section)).toEqual([
            '1',
            '2',
        ]);
    });

    it('getActiveGlobalCardContext returns the active card (used by commands)', () => {
        globalViewStore.set(viewStore);
        globalCardListStore.set([
            { filePath: 'a.md', nodeId: 'n1', section: '1', categoryId: 'c1' },
        ]);
        registerVirtualView(
            'a.md',
            {} as unknown as VirtualLineageView,
        );
        routeGlobalCommand('go_down', fakeEvent(), container, { viewStore });
        const ctx = getActiveGlobalCardContext();
        expect(ctx?.card.nodeId).toBe('n1');
        expect(ctx?.card.categoryId).toBe('c1');
        expect(ctx?.virtualView).toBeDefined();

        // nothing selected → no context
        const fake = viewStore.getValue() as unknown as FakeState;
        fake.pinnedNodes.activeNode = '';
        fake.recentNodes.activeNode = '';
        expect(getActiveGlobalCardContext()).toBeNull();
    });

    it('jumps to the next/previous search result (wrapping)', async () => {
        globalCardListStore.set([
            { filePath: 'a.md', nodeId: 'n1', section: '1', categoryId: 'c1' },
            { filePath: 'a.md', nodeId: 'n2', section: '2', categoryId: 'c1' },
            { filePath: 'b.md', nodeId: 'n3', section: '1', categoryId: 'c1' },
        ]);
        const real = viewStore.getValue() as unknown as FakeState;
        real.search.query = 'x';
        real.search.results = new Map([
            ['n1', {}],
            ['n3', {}],
        ]);
        // container returns the card element so scrolling does not poll
        const scrollable = {
            querySelector: (sel: string) => {
                const id = /\[id="?([^"]+?)"?\]/.exec(sel)?.[1];
                return id === 'n1' || id === 'n3' ? {} : null;
            },
        } as unknown as HTMLElement;

        // no active match yet → next lands on the first match
        await jumpToSearchResult(viewStore, scrollable, 1);
        expect(getActive(viewStore)).toBe('n1');
        // next again → n3
        await jumpToSearchResult(viewStore, scrollable, 1);
        expect(getActive(viewStore)).toBe('n3');
        // next wraps back to n1
        await jumpToSearchResult(viewStore, scrollable, 1);
        expect(getActive(viewStore)).toBe('n1');
        // previous from n1 wraps to n3
        await jumpToSearchResult(viewStore, scrollable, -1);
        expect(getActive(viewStore)).toBe('n3');
    });

    it('jumpToSearchResult is a no-op without an active query or matches', async () => {
        globalCardListStore.set([
            { filePath: 'a.md', nodeId: 'n1', section: '1', categoryId: 'c1' },
        ]);
        const scrollable = {
            querySelector: () => null,
        } as unknown as HTMLElement;
        const real = viewStore.getValue() as unknown as FakeState;
        real.search.query = '';
        real.search.results = new Map();
        await jumpToSearchResult(viewStore, scrollable, 1);
        expect(getActive(viewStore)).toBe('');

        real.search.query = 'x';
        real.search.results = new Map([['does-not-exist', {}]]);
        await jumpToSearchResult(viewStore, scrollable, 1);
        expect(getActive(viewStore)).toBe('');
    });
});
