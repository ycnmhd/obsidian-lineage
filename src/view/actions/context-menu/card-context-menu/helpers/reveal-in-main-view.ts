import { LineageView } from 'src/view/view';
import { focusContainer } from 'src/stores/view/subscriptions/effects/focus-container';

/**
 * Reveal a card in the main document view. Sets the card as the document's
 * active node; the align-branch effect then scrolls the main view so the card
 * is visible and centered (see AlignBranch / the vertical & horizontal reveal
 * actions). Finally the main view container is focused so the user lands in
 * the main view ready to navigate.
 */
export const revealInMainView = (view: LineageView, nodeId: string) => {
    view.viewStore.dispatch({
        type: 'view/set-active-node/mouse',
        payload: { id: nodeId },
    });
    focusContainer(view);
};
