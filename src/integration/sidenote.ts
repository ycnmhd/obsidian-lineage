/**
 * Integration module for SideNote plugin.
 * Exports functions that SideNote can use to register highlights
 * with the Lineage plugin's rendering pipeline.
 *
 * Usage from SideNote:
 * ```typescript
 * const lineage = app.plugins.plugins['lineage'];
 * if (lineage) {
 *     lineage.registerNodeHighlights(nodeId, [{
 *         id: 'comment-123',
 *         className: 'sidenote-highlight',
 *         text: 'text to highlight',
 *         onClick: () => console.log('clicked!'),
 *     }]);
 * }
 * ```
 */

import { ExternalHighlight, registerHighlights, clearHighlights } from 'src/lib/highlight-registry';

/**
 * Register highlights for a Lineage node.
 * Call this when a comment should be highlighted in a specific node.
 *
 * @param nodeId - The Lineage node ID
 * @param highlights - Array of highlights to register
 */
export function registerNodeHighlights(nodeId: string, highlights: ExternalHighlight[]): void {
    registerHighlights(nodeId, highlights);
}

/**
 * Clear all highlights for a Lineage node.
 * Call this when a comment is removed or the node content changes.
 *
 * @param nodeId - The Lineage node ID
 */
export function clearNodeHighlights(nodeId: string): void {
    clearHighlights(nodeId);
}
