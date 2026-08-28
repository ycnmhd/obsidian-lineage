import { get, writable } from 'svelte/store';
import type { ViewStore } from 'src/view/view';
import type { VirtualLineageView } from './create-virtual-view';
import { saveNodeContent } from 'src/view/actions/keyboard-shortcuts/helpers/commands/commands/helpers/save-node-content';
import { cancelChanges } from 'src/view/actions/keyboard-shortcuts/helpers/commands/commands/helpers/cancel-changes';
import type { LineageView } from 'src/view/view';
import { moveCardInCategory } from './move-card-in-category';
import { delay } from 'src/helpers/delay';

export type GlobalCardNavItem = {
    filePath: string;
    nodeId: string;
    section: string;
    categoryId: string;
};

/**
 * Ordered list of cards currently visible in the global categories view
 * (across all file groups). Maintained by the card list components; consumed
 * by the keyboard navigation below.
 */
export const globalCardListStore = writable<GlobalCardNavItem[]>([]);

/**
 * The shared view store of the mounted global categories view (or null when
 * the view is closed). Needed by commands (e.g. copy-link-to-block) to find
 * the currently selected card. Set by the global view on mount/unmount.
 */
export const globalViewStore = writable<ViewStore | null>(null);

/**
 * Virtual views of the file groups currently mounted in the global view,
 * keyed by file path. Needed by edit/save commands (their inline editors are
 * owned by the per-file virtual views).
 */
export const globalVirtualViewsStore = writable<
    Record<string, VirtualLineageView>
>({});

export const registerVirtualView = (
    filePath: string,
    view: VirtualLineageView,
) => {
    globalVirtualViewsStore.update((map) => ({ ...map, [filePath]: view }));
};

export const unregisterVirtualView = (filePath: string) => {
    globalVirtualViewsStore.update((map) => {
        const next = { ...map };
        delete next[filePath];
        return next;
    });
};

export type GlobalKeyboardContext = {
    viewStore: ViewStore;
};

const setActiveGlobalCard = (viewStore: ViewStore, nodeId: string) => {
    viewStore.dispatch({
        type: 'view/pinned-nodes/set-active-node',
        payload: { id: nodeId },
    });
    viewStore.dispatch({
        type: 'view/recent-nodes/set-active-node',
        payload: { id: nodeId },
    });
};

const scrollToCard = (container: HTMLElement, nodeId: string) => {
    const el = container.querySelector(`[id="${nodeId}"]`);
    // optional call: jsdom/test environments don't implement scrollIntoView
    el?.scrollIntoView?.({ behavior: 'smooth', block: 'center' });
};

/**
 * Scroll to a card once it is actually present in the DOM (polls). Handles
 * the async re-render timing of the filtered card list.
 */
const scrollToCardAfterMount = async (
    container: HTMLElement,
    nodeId: string,
) => {
    const deadline = Date.now() + 2000;
    while (Date.now() < deadline) {
        const el = container.querySelector(`[id="${nodeId}"]`);
        if (el) {
            el.scrollIntoView?.({ behavior: 'smooth', block: 'center' });
            return;
        }
        await delay(30);
    }
};

/**
 * Activate + scroll to the first card matching the active search, if any.
 */
export const scrollToFirstSearchResult = async (
    viewStore: ViewStore,
    container: HTMLElement,
) => {
    const state = viewStore.getValue();
    const results = state.search.results;
    if (!state.search.query || results.size === 0) return;

    // The first visible card is the first nav list item whose nodeId is a
    // search match (the nav list is rebuilt from the filtered render list).
    const items = get(globalCardListStore);
    const firstMatch = items.find((i) => results.has(i.nodeId));
    const nodeId = firstMatch?.nodeId ?? Array.from(results.keys())[0];
    if (!nodeId) return;

    const activeId =
        state.pinnedNodes.activeNode || state.recentNodes.activeNode;
    if (activeId !== nodeId) {
        setActiveGlobalCard(viewStore, nodeId);
    }

    await scrollToCardAfterMount(container, nodeId);
};

/**
 * Move to the next/previous card that matches the active search (wrapping),
 * activate it and scroll it into view. No-op if search is inactive or no
 * matches are visible.
 */
export const jumpToSearchResult = async (
    viewStore: ViewStore,
    container: HTMLElement,
    direction: 1 | -1,
) => {
    const state = viewStore.getValue();
    if (!state.search.query || state.search.results.size === 0) return;

    const items = get(globalCardListStore);
    const matches = items
        .map((i) => i.nodeId)
        .filter((id) => state.search.results.has(id));
    if (matches.length === 0) return;

    const activeId =
        state.pinnedNodes.activeNode || state.recentNodes.activeNode;
    let currentIndex = matches.indexOf(activeId);
    // no active match yet → start at the first (or the last when going back)
    if (currentIndex === -1) {
        currentIndex = direction === 1 ? -1 : 0;
    }
    const next =
        matches[(currentIndex + direction + matches.length) % matches.length];

    setActiveGlobalCard(viewStore, next);
    await scrollToCardAfterMount(container, next);
};

const getActiveIndex = (
    viewStore: ViewStore,
    items: GlobalCardNavItem[],
) => {
    const state = viewStore.getValue();
    const activeId =
        state.pinnedNodes.activeNode || state.recentNodes.activeNode;
    if (!activeId) return -1;
    return items.findIndex((i) => i.nodeId === activeId);
};

/** The currently active card (if any) and the virtual view of its file. */
const getActiveCardContext = (
    viewStore: ViewStore,
): {
    card: GlobalCardNavItem;
    virtualView: VirtualLineageView;
} | null => {
    const items = get(globalCardListStore);
    const index = getActiveIndex(viewStore, items);
    if (index === -1) return null;
    const card = items[index];
    const virtualView = get(globalVirtualViewsStore)[card.filePath];
    if (!virtualView) return null;
    return { card, virtualView };
};

/**
 * The active card in the mounted global categories view (if any). Exported
 * so Obsidian commands (e.g. copy-link-to-block) can act on it when the
 * global view is focused instead of a Lineage view.
 */
export const getActiveGlobalCardContext = (): {
    card: GlobalCardNavItem;
    virtualView: VirtualLineageView;
} | null => {
    const viewStore = get(globalViewStore);
    if (!viewStore) return null;
    return getActiveCardContext(viewStore);
};

const enableEditModeInGlobalView = (
    ctx: GlobalKeyboardContext,
    nodeId: string,
) => {
    ctx.viewStore.dispatch({
        type: 'view/editor/enable-sidebar-editor',
        payload: { id: nodeId },
        context: { activeSidebarTab: 'pinned-cards' },
    });
};

/** Move the active card up/down within the whole visible list. */
const navigate = (
    direction: 'up' | 'down',
    container: HTMLElement,
    ctx: GlobalKeyboardContext,
) => {
    const items = get(globalCardListStore);
    if (items.length === 0) return;
    const current = getActiveIndex(ctx.viewStore, items);
    let target: number;
    if (current === -1) {
        target = direction === 'down' ? 0 : items.length - 1;
    } else {
        target =
            direction === 'down'
                ? Math.min(items.length - 1, current + 1)
                : Math.max(0, current - 1);
    }
    if (target === current) return;
    const card = items[target];
    setActiveGlobalCard(ctx.viewStore, card.nodeId);
    scrollToCard(container, card.nodeId);
};

const getGroupStarts = (items: GlobalCardNavItem[]) => {
    const starts: number[] = [];
    let previous: string | null = null;
    items.forEach((item, i) => {
        if (item.filePath !== previous) {
            starts.push(i);
            previous = item.filePath;
        }
    });
    return starts;
};

/** Move to the first card of the previous/next file group. */
const navigateGroup = (
    delta: 1 | -1,
    container: HTMLElement,
    ctx: GlobalKeyboardContext,
) => {
    const items = get(globalCardListStore);
    if (items.length === 0) return;
    const starts = getGroupStarts(items);
    if (starts.length <= 1) {
        // single group → behave like simple navigation
        navigate(delta === 1 ? 'down' : 'up', container, ctx);
        return;
    }
    const current = getActiveIndex(ctx.viewStore, items);
    let currentGroup = starts.length - 1;
    if (current !== -1) {
        for (let g = 0; g < starts.length; g++) {
            const nextStart =
                g < starts.length - 1 ? starts[g + 1] : items.length;
            if (current >= starts[g] && current < nextStart) {
                currentGroup = g;
                break;
            }
        }
    }
    const targetGroup =
        delta === 1
            ? Math.min(starts.length - 1, currentGroup + 1)
            : Math.max(0, currentGroup - 1);
    const card = items[starts[targetGroup]];
    setActiveGlobalCard(ctx.viewStore, card.nodeId);
    scrollToCard(container, card.nodeId);
};

/** Jump to the first/last card of the current group or of the whole list. */
const navigateToEdge = (
    edge: 'start' | 'end',
    scope: 'all' | 'group',
    container: HTMLElement,
    ctx: GlobalKeyboardContext,
) => {
    const items = get(globalCardListStore);
    if (items.length === 0) return;
    const current = getActiveIndex(ctx.viewStore, items);
    let target: number;
    if (scope === 'all') {
        target = edge === 'start' ? 0 : items.length - 1;
    } else {
        const starts = getGroupStarts(items);
        if (starts.length <= 1) {
            target = edge === 'start' ? 0 : items.length - 1;
        } else {
            let currentGroup = current === -1 ? 0 : starts.length - 1;
            if (current !== -1) {
                for (let g = 0; g < starts.length; g++) {
                    const nextStart =
                        g < starts.length - 1 ? starts[g + 1] : items.length;
                    if (current >= starts[g] && current < nextStart) {
                        currentGroup = g;
                        break;
                    }
                }
            }
            target =
                edge === 'start'
                    ? starts[currentGroup]
                    : currentGroup < starts.length - 1
                      ? starts[currentGroup + 1] - 1
                      : items.length - 1;
        }
    }
    if (target === current) return;
    const card = items[target];
    setActiveGlobalCard(ctx.viewStore, card.nodeId);
    scrollToCard(container, card.nodeId);
};

/**
 * Routes a resolved hotkey command to global-view navigation. Only the
 * navigation command names are handled; everything else is ignored.
 */
export const routeGlobalCommand = (
    name: string,
    event: KeyboardEvent,
    container: HTMLElement,
    ctx: GlobalKeyboardContext,
) => {
    switch (name) {
        case 'go_down':
        case 'navigate_to_next_node':
            event.preventDefault();
            navigate('down', container, ctx);
            break;
        case 'go_up':
        case 'navigate_to_previous_node':
            event.preventDefault();
            navigate('up', container, ctx);
            break;
        case 'go_right':
            event.preventDefault();
            navigateGroup(1, container, ctx);
            break;
        case 'go_left':
        case 'select_parent':
            event.preventDefault();
            navigateGroup(-1, container, ctx);
            break;
        case 'go_to_beginning_of_column':
            event.preventDefault();
            navigateToEdge('start', 'all', container, ctx);
            break;
        case 'go_to_end_of_column':
            event.preventDefault();
            navigateToEdge('end', 'all', container, ctx);
            break;
        case 'go_to_beginning_of_group':
            event.preventDefault();
            navigateToEdge('start', 'group', container, ctx);
            break;
        case 'go_to_end_of_group':
            event.preventDefault();
            navigateToEdge('end', 'group', container, ctx);
            break;
        case 'disable_edit_mode': {
            // Escape while editing: cancel changes (discard) and close the
            // editor, matching the main view behaviour
            event.preventDefault();
            const context = getActiveCardContext(ctx.viewStore);
            if (context) {
                cancelChanges(context.virtualView as unknown as LineageView);
            } else {
                ctx.viewStore.dispatch({
                    type: 'view/editor/disable-sidebar-editor',
                });
            }
            break;
        }
        case 'enable_edit_mode': {
            // Enter on an active card → edit it inline
            event.preventDefault();
            const context = getActiveCardContext(ctx.viewStore);
            if (context) enableEditModeInGlobalView(ctx, context.card.nodeId);
            break;
        }
        case 'enable_edit_mode_and_place_cursor_at_start': {
            event.preventDefault();
            const context = getActiveCardContext(ctx.viewStore);
            if (context) {
                context.virtualView.inlineEditor.setNodeCursor(
                    context.card.nodeId,
                    { line: 0, ch: 0 },
                );
                enableEditModeInGlobalView(ctx, context.card.nodeId);
            }
            break;
        }
        case 'enable_edit_mode_and_place_cursor_at_end': {
            event.preventDefault();
            const context = getActiveCardContext(ctx.viewStore);
            if (context) {
                context.virtualView.inlineEditor.deleteNodeCursor(
                    context.card.nodeId,
                );
                enableEditModeInGlobalView(ctx, context.card.nodeId);
            }
            break;
        }
        case 'save_changes_and_exit_card': {
            // Mod+Shift+Enter while editing → save and close the editor
            event.preventDefault();
            const context = getActiveCardContext(ctx.viewStore);
            if (context) {
                saveNodeContent(
                    context.virtualView as unknown as LineageView,
                );
            }
            break;
        }
        case 'move_node_up':
        case 'move_node_down': {
            // same hotkeys as in the main view (default Alt+Shift+J/K)
            event.preventDefault();
            const context = getActiveCardContext(ctx.viewStore);
            if (!context) return;
            moveCardInCategory(
                context.virtualView.plugin,
                context.card.categoryId,
                context.card,
                name === 'move_node_up' ? -1 : 1,
            );
            break;
        }
        case 'toggle_search_input': {
            // reuse the main view's search toggle (default '/' and Alt+F)
            event.preventDefault();
            ctx.viewStore.dispatch({ type: 'view/search/toggle-input' });
            break;
        }
    }
};
