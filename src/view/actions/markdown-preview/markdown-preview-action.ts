import { MarkdownRenderer } from 'obsidian';
import { getPlugin, getView } from 'src/view/components/container/context';
import { contentStore } from 'src/stores/document/derived/content-store';
import { formatText } from 'src/view/actions/markdown-preview/helpers/format-text';
import { highlightSearch } from 'src/view/actions/markdown-preview/helpers/highlight-search';
import { derived } from 'src/lib/store/derived';
import { getClickCallback, subscribeToHighlightChanges } from 'src/lib/highlight-registry';

const HIGHLIGHT_DEBOUNCE_MS = 150;

export const markdownPreviewAction = (
    element: HTMLElement,
    params: { nodeId: string }
) => {
    const plugin = getPlugin();
    const view = getView();

    // Mark this container so other plugins (SideNote) can skip it in
    // markdown post-processors and avoid slowing down Lineage re-renders.
    element.setAttribute('data-lineage-card', params.nodeId);

    const render = (content: string, searchQuery: string) => {
        // Read search match status directly from the view store (reactive).
        // Only apply highlights to cards Fuse.js already matched —
        // non-matching cards skip substring matching entirely.
        const isMatch = view.viewStore.getValue().search.results.has(params.nodeId);
        if (view && element) {
            element.empty();
            if (content.length > 0) {
                if (isMatch) {
                    content = highlightSearch(content, searchQuery, params.nodeId);
                }
                content = formatText(content);
            }
            MarkdownRenderer.render(
                plugin.app,
                content,
                element,
                view.file!.path,
                view,
            );

            // Set up click handlers for external highlights
            setupHighlightClickHandlers(element);
        }
    };

    // Get the search query reactively from the view store
    const searchQueryStore = derived(view.viewStore, (state) => {
        return state.search.query;
    });

    const $content = contentStore(view, params.nodeId);
    let currentContent = '';
    let currentSearchQuery = '';
    let highlightTimeout: ReturnType<typeof setTimeout> | null = null;

    const unsubContent = $content.subscribe((content) => {
        currentContent = content;
        render(currentContent, currentSearchQuery);
    });

    const unsubSearch = searchQueryStore.subscribe((query) => {
        currentSearchQuery = query;

        // Debounce highlight updates during typing
        if (highlightTimeout) {
            clearTimeout(highlightTimeout);
        }
        highlightTimeout = setTimeout(() => {
            render(currentContent, currentSearchQuery);
            highlightTimeout = null;
        }, HIGHLIGHT_DEBOUNCE_MS);
    });

    // Subscribe to external highlight changes (e.g., from SideNote)
    const unsubHighlights = subscribeToHighlightChanges((changedNodeId) => {
        if (changedNodeId === params.nodeId) {
            render(currentContent, currentSearchQuery);
        }
    });

    return {
        destroy: () => {
            unsubContent();
            unsubSearch();
            unsubHighlights();
            if (highlightTimeout) {
                clearTimeout(highlightTimeout);
            }
        },
    };
};

/**
 * Sets up click handlers for external highlights in the rendered content.
 */
function setupHighlightClickHandlers(container: HTMLElement): void {
    const highlights = container.querySelectorAll('[data-highlight-id]');
    highlights.forEach((el) => {
        const highlightId = el.getAttribute('data-highlight-id');
        if (highlightId) {
            const callback = getClickCallback(highlightId);
            if (callback) {
                el.addEventListener('click', (e: MouseEvent) => {
                    e.preventDefault();
                    e.stopPropagation();
                    callback();
                });
            }
        }
    });
}
