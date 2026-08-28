import { ExternalHighlight, getHighlights } from 'src/lib/highlight-registry';

/**
 * Represents a highlight range with its type and styling.
 */
interface HighlightRange {
    start: number;
    end: number;
    className: string;
    highlightId?: string;
}

/**
 * Finds all occurrences of a search term in the content (case-insensitive).
 * Returns an array of [start, end] indices for each match.
 */
function findSubstringMatches(content: string, searchTerm: string): [number, number][] {
    if (!searchTerm) return [];

    const matches: [number, number][] = [];
    const lowerContent = content.toLowerCase();
    const lowerSearch = searchTerm.toLowerCase();

    let startPos = 0;
    while (true) {
        const index = lowerContent.indexOf(lowerSearch, startPos);
        if (index === -1) break;
        matches.push([index, index + searchTerm.length - 1]);
        startPos = index + 1; // Find overlapping matches
    }

    return matches;
}

/**
 * Finds exact occurrences of text in content (case-sensitive).
 * Returns an array of [start, end] indices for each match.
 */
function findExactMatches(content: string, searchText: string): [number, number][] {
    if (!searchText) return [];

    const matches: [number, number][] = [];
    let startPos = 0;

    while (true) {
        const index = content.indexOf(searchText, startPos);
        if (index === -1) break;
        matches.push([index, index + searchText.length - 1]);
        startPos = index + 1;
    }

    return matches;
}

/**
 * Collects all highlight ranges from search query and external highlights.
 */
function collectHighlightRanges(
    content: string,
    searchQuery: string,
    externalHighlights: ExternalHighlight[]
): HighlightRange[] {
    const ranges: HighlightRange[] = [];

    // Add search query matches (case-insensitive)
    if (searchQuery) {
        const searchMatches = findSubstringMatches(content, searchQuery);
        for (const [start, end] of searchMatches) {
            ranges.push({ start, end, className: 'search-highlight' });
        }
    }

    // Add external highlights (case-sensitive)
    for (const highlight of externalHighlights) {
        const exactMatches = findExactMatches(content, highlight.text);
        for (const [start, end] of exactMatches) {
            ranges.push({
                start,
                end,
                className: highlight.className,
                highlightId: highlight.id,
            });
        }
    }

    return ranges;
}

/**
 * Applies all highlight ranges to the content.
 * Handles overlapping ranges by using the first (highest priority) highlight.
 */
function applyHighlights(content: string, ranges: HighlightRange[]): string {
    if (ranges.length === 0) return content;

    // Sort ranges by start position, then by length (longer first for overlaps)
    ranges.sort((a, b) => a.start - b.start || (b.end - b.start) - (a.end - a.start));

    // Build a map of character index -> highlight range (first wins for overlaps)
    const charHighlight: Map<number, HighlightRange> = new Map();

    for (const range of ranges) {
        for (let i = range.start; i <= range.end; i++) {
            if (!charHighlight.has(i)) {
                charHighlight.set(i, range);
            }
        }
    }

    // Build result by wrapping contiguous ranges with same highlight
    let result = '';
    let currentHighlight: HighlightRange | null = null;
    let markStart = 0;

    for (let i = 0; i <= content.length; i++) {
        const highlight = i < content.length ? charHighlight.get(i) ?? null : null;

        // Check if highlight changed
        const highlightChanged = !areSameHighlights(currentHighlight, highlight);

        if (highlightChanged) {
            // Close current highlight if open
            if (currentHighlight) {
                const tag = currentHighlight.highlightId
                    ? `<span class="${currentHighlight.className}" data-highlight-id="${currentHighlight.highlightId}">`
                    : `<mark class="${currentHighlight.className}">`;
                const closeTag = currentHighlight.highlightId ? '</span>' : '</mark>';
                result += `${tag}${content.slice(markStart, i)}${closeTag}`;
            }

            // Start new highlight or plain text
            currentHighlight = highlight;
            markStart = i;
        }

        // Add plain text if no highlight
        if (!highlight && i < content.length) {
            result += content[i];
        }
    }

    // Close any remaining highlight
    if (currentHighlight) {
        const tag = currentHighlight.highlightId
            ? `<span class="${currentHighlight.className}" data-highlight-id="${currentHighlight.highlightId}">`
            : `<mark class="${currentHighlight.className}">`;
        const closeTag = currentHighlight.highlightId ? '</span>' : '</mark>';
        result += `${tag}${content.slice(markStart)}${closeTag}`;
    }

    return result;
}

/**
 * Compares two highlight ranges for equality.
 */
function areSameHighlights(a: HighlightRange | null, b: HighlightRange | null): boolean {
    if (!a && !b) return true;
    if (!a || !b) return false;
    return a.className === b.className && a.highlightId === b.highlightId;
}

/**
 * Wraps matched character ranges in the content with highlight tags.
 * Applies both search highlights (case-insensitive) and external highlights (case-sensitive).
 * External highlights take priority over search highlights when they overlap.
 */
export function highlightSearch(
    content: string,
    searchQuery: string,
    nodeId?: string
): string {
    // Get external highlights for this node
    const externalHighlights = nodeId ? getHighlights(nodeId) : [];

    // Collect all highlight ranges
    const ranges = collectHighlightRanges(content, searchQuery, externalHighlights);

    // Apply highlights
    return applyHighlights(content, ranges);
}
