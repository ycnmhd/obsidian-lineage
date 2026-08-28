import { LineageView } from 'src/view/view';
import { Settings } from 'src/stores/settings/settings-type';
import { applyFontSize } from 'src/stores/view/subscriptions/effects/css-variables/apply-font-size';
import { applyCssColor } from 'src/stores/view/subscriptions/effects/css-variables/apply-css-color';
import { applyCardWidth } from 'src/stores/view/subscriptions/effects/css-variables/apply-card-width';
import { applyZoomLevel } from './effects/css-variables/apply-zoom-level';
import { applyCardsGap } from 'src/stores/view/subscriptions/effects/css-variables/apply-cards-gap';
import { focusContainer } from 'src/stores/view/subscriptions/effects/focus-container';
import { applyCardIndentationWidth } from 'src/stores/view/subscriptions/effects/css-variables/apply-card-indentation-width';
import { applyInactiveNodeOpacity } from 'src/stores/view/subscriptions/effects/css-variables/apply-inactive-node-opacity';
import { getUsedHotkeys } from 'src/obsidian/helpers/get-used-hotkeys';
import { applyHeadingsFontSize } from 'src/stores/view/subscriptions/effects/css-variables/apply-headings-font-size';
import { SettingsActions } from 'src/stores/settings/settings-store-actions';

export const onPluginSettingsUpdate = (
    view: LineageView,
    state: Settings,
    action: SettingsActions,
) => {
    if (!view.container) return;
    const type = action.type;
    if (type === 'settings/view/theme/set-font-size') {
        applyFontSize(view, state.view.fontSize);
    } else if (type === 'settings/view/theme/set-h1-font-size') {
        applyHeadingsFontSize(view, state.view.h1FontSize_em);
    } else if (type === 'settings/view/theme/set-container-bg-color') {
        applyCssColor(view, 'containerBg');
    } else if (type === 'settings/view/theme/set-active-branch-bg-color') {
        applyCssColor(view, 'activeBranchBg');
    } else if (type === 'settings/view/layout/set-card-width') {
        applyCardWidth(view, state.view.cardWidth);
    } else if (type === 'settings/view/layout/set-cards-gap') {
        applyCardsGap(view, state.view.cardsGap);
    } else if (action.type === 'settings/view/set-zoom-level') {
        applyZoomLevel(view, state.view.zoomLevel);
        view.zoomFactor = state.view.zoomLevel;
    } else if (action.type === 'settings/documents/set-document-format') {
        view.saveDocument();
    } else if (type === 'settings/view/set-node-indentation-width') {
        applyCardIndentationWidth(view, state.view.nodeIndentationWidth);
    } else if (type === 'settings/view/theme/set-inactive-node-opacity') {
        applyInactiveNodeOpacity(view, state.view.theme.inactiveNodeOpacity);
    } else if (type === 'settings/view/theme/set-active-branch-color') {
        applyCssColor(view, 'activeBranchColor');
    } else if (
        type === 'settings/hotkeys/reset-all' ||
        type === 'settings/hotkeys/apply-preset' ||
        type === 'settings/hotkeys/reset-custom-hotkey' ||
        type === 'settings/hotkeys/set-custom-hotkey' ||
        type === 'settings/hotkeys/set-blank'
    ) {
        view.viewStore.dispatch({
            type: 'view/hotkeys/update-conflicts',
            payload: {
                conflicts: getUsedHotkeys(view.plugin),
            },
        });
    } else if (type === 'settings/view/modes/toggle-outline-mode') {
        if (state.view.outlineMode) {
            view.viewStore.dispatch({
                type: 'view/outline/refresh-collapsed-nodes',
            });
        }
    }

    const shouldAlign =
        type === 'view/left-sidebar/set-width' ||
        type === 'settings/view/set-zoom-level' ||
        type === 'settings/view/layout/set-card-width' ||
        type === 'settings/view/layout/set-limit-card-height' ||
        type === 'settings/view/toggle-minimap' ||
        type === 'settings/view/toggle-horizontal-scrolling-mode' ||
        type === 'settings/view/toggle-vertical-scrolling-mode' ||
        type === 'settings/view/layout/set-cards-gap' ||
        type === 'view/modes/gap-between-cards/toggle' ||
        type === 'settings/view/set-node-indentation-width';
    if (shouldAlign) {
        view.alignBranch.align(action);
    }
    if (view.isActive && type === 'settings/view/set-zoom-level') {
        focusContainer(view);
    }

    const shouldUpdateStyleRules =
        type === 'settings/style-rules/add' ||
        type === 'settings/style-rules/update' ||
        type === 'settings/style-rules/delete' ||
        type === 'settings/style-rules/update-condition' ||
        type === 'settings/style-rules/enable-rule' ||
        type === 'settings/style-rules/disable-rule' ||
        type === 'settings/style-rules/move' ||
        type === 'settings/style-rules/update-style' ||
        type === 'settings/style-rules/toggle-global';
    if (shouldUpdateStyleRules) {
        view.rulesProcessor.onRulesUpdate();
    }
};
