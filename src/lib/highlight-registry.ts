/**
 * Registry for external highlights (e.g., from SideNote plugin).
 * Allows other plugins to register highlights that will be applied
 * during the markdown rendering pipeline.
 */

export interface ExternalHighlight {
    /** Unique identifier for this highlight */
    id: string;
    /** CSS class to apply to the highlight */
    className: string;
    /** The text to highlight (case-sensitive) */
    text: string;
    /** Optional: click handler callback */
    onClick?: () => void;
}

/**
 * Map of nodeId -> array of external highlights for that node.
 */
export interface HighlightRegistry {
    [nodeId: string]: ExternalHighlight[];
}

/**
 * Callback type for highlight change notifications.
 */
type HighlightChangeCallback = (nodeId: string) => void;

/**
 * Map of highlight id -> click callback.
 */
const clickCallbacks = new Map<string, () => void>();

/**
 * Global highlight registry instance.
 */
const registry: HighlightRegistry = {};

/**
 * Subscribers to highlight changes.
 */
const changeSubscribers = new Set<HighlightChangeCallback>();

/**
 * Register highlights for a specific node.
 * @param nodeId - The node ID to register highlights for
 * @param highlights - Array of highlights to register
 */
export function registerHighlights(nodeId: string, highlights: ExternalHighlight[]): void {
    registry[nodeId] = highlights;

    // Register click callbacks
    for (const highlight of highlights) {
        if (highlight.onClick) {
            clickCallbacks.set(highlight.id, highlight.onClick);
        }
    }

    // Notify subscribers
    changeSubscribers.forEach(callback => callback(nodeId));
}

/**
 * Subscribe to highlight changes for a node.
 * @param callback - Function to call when highlights change
 * @returns Unsubscribe function
 */
export function subscribeToHighlightChanges(callback: HighlightChangeCallback): () => void {
    changeSubscribers.add(callback);
    return () => {
        changeSubscribers.delete(callback);
    };
}

/**
 * Get highlights for a specific node.
 * @param nodeId - The node ID to get highlights for
 * @returns Array of highlights, or empty array if none registered
 */
export function getHighlights(nodeId: string): ExternalHighlight[] {
    return registry[nodeId] ?? [];
}

/**
 * Get the click callback for a highlight.
 * @param highlightId - The highlight ID
 * @returns The click callback, or undefined if not registered
 */
export function getClickCallback(highlightId: string): (() => void) | undefined {
    return clickCallbacks.get(highlightId);
}

/**
 * Clear all highlights for a specific node.
 * @param nodeId - The node ID to clear highlights for
 */
export function clearHighlights(nodeId: string): void {
    // Clear click callbacks for this node's highlights
    const highlights = registry[nodeId];
    if (highlights) {
        for (const highlight of highlights) {
            clickCallbacks.delete(highlight.id);
        }
    }
    delete registry[nodeId];

    // Notify subscribers
    changeSubscribers.forEach(callback => callback(nodeId));
}

/**
 * Clear all highlights for all nodes.
 */
export function clearAllHighlights(): void {
    Object.keys(registry).forEach(key => delete registry[key]);
    clickCallbacks.clear();
}

/**
 * Get all registered highlights.
 * @returns The entire registry
 */
export function getAllHighlights(): HighlightRegistry {
    return registry;
}
