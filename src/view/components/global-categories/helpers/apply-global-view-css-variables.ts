import type Lineage from 'src/main';
import { Unsubscriber } from 'svelte/store';
import { applyFontSize } from 'src/stores/view/subscriptions/effects/css-variables/apply-font-size';
import { applyCssColor } from 'src/stores/view/subscriptions/effects/css-variables/apply-css-color';
import { applyCardWidth } from 'src/stores/view/subscriptions/effects/css-variables/apply-card-width';
import { applyZoomLevel } from 'src/stores/view/subscriptions/effects/css-variables/apply-zoom-level';
import { applyCardsGap } from 'src/stores/view/subscriptions/effects/css-variables/apply-cards-gap';
import { applyCardIndentationWidth } from 'src/stores/view/subscriptions/effects/css-variables/apply-card-indentation-width';
import { applyInactiveNodeOpacity } from 'src/stores/view/subscriptions/effects/css-variables/apply-inactive-node-opacity';
import { applyHeadingsFontSize } from 'src/stores/view/subscriptions/effects/css-variables/apply-headings-font-size';

/**
 * Applies the user's view settings (card width, gap, colors, font sizes,
 * inactive-node opacity, …) to the global categories view, mirroring what the
 * main Lineage view does for its own container — so cards render with the same
 * styling in both places.
 *
 * Returns an unsubscribe function; call it when the global view closes.
 */
export const subscribeGlobalViewCssVariables = (
    plugin: Lineage,
    containerEl: HTMLElement,
): Unsubscriber => {
    // the apply-* helpers only touch view.containerEl / view.contentEl and
    // view.plugin.settings
    const view = { containerEl, contentEl: containerEl, plugin } as never;

    const apply = () => {
        const state = plugin.settings.getValue();
        applyFontSize(view, state.view.fontSize);
        applyHeadingsFontSize(view, state.view.h1FontSize_em);
        applyCssColor(view, 'containerBg');
        applyCssColor(view, 'activeBranchBg');
        applyCssColor(view, 'activeBranchColor');
        applyCardWidth(view, state.view.cardWidth);
        applyCardsGap(view, state.view.cardsGap);
        applyZoomLevel(view, 1);
        applyCardIndentationWidth(view, state.view.nodeIndentationWidth);
        applyInactiveNodeOpacity(view, state.view.theme.inactiveNodeOpacity);
    };
    apply();
    return plugin.settings.subscribe(apply);
};
