import { LineageView } from 'src/view/view';
import {
    DocumentEventType,
    getDocumentEventType,
} from 'src/stores/view/helpers/get-document-event-type';
import {
    getViewEventType,
    ViewEventType,
} from 'src/stores/view/helpers/get-view-event-type';
import { alignBranchDebounced } from 'src/stores/view/subscriptions/effects/align-branch/align-branch';
import { updateSearchResults } from 'src/stores/view/subscriptions/actions/update-search-results/update-search-results';
import { DocumentStoreAction } from 'src/stores/document/document-store-actions';
import { updateActiveBranch } from 'src/stores/view/subscriptions/actions/update-active-branch';
import { setActiveNode } from 'src/stores/view/subscriptions/actions/set-active-node';
import { enableEditMode } from 'src/stores/view/subscriptions/actions/enable-edit-mode';
import { removeObsoleteNavigationItems } from 'src/stores/view/subscriptions/actions/remove-obsolete-navigation-items';
import { focusContainer } from 'src/stores/view/subscriptions/effects/focus-container';
import { resetSearchFuse } from 'src/stores/view/subscriptions/actions/update-search-results/helpers/reset-search-fuse';
import { applyZoom } from 'src/stores/view/subscriptions/effects/align-branch/helpers/apply-zoom';
import { ViewStoreAction } from 'src/stores/view/view-store-actions';
import { isEmptyDocument } from 'src/stores/view/subscriptions/helpers/is-empty-document';
import { discardChanges } from 'src/view/actions/keyboard-shortcuts/helpers/commands/commands/helpers/cancel-changes';
import { applyFontSize } from 'src/stores/view/subscriptions/effects/css-variables/apply-font-size';
import { applyContainerBg } from 'src/stores/view/subscriptions/effects/css-variables/apply-container-bg';
import { applyActiveBranchBg } from 'src/stores/view/subscriptions/effects/css-variables/apply-active-branch-bg';
import { applyCardWidth } from 'src/stores/view/subscriptions/effects/css-variables/apply-card-width';
import { hotkeyStore } from 'src/stores/hotkeys/hotkey-store';
import { getUsedHotkeys } from 'src/obsidian/helpers/get-used-hotkeys';
import { updateStatusBar } from 'src/stores/view/subscriptions/effects/update-status-bar';
import { Notice } from 'obsidian';
import { saveNodeContent } from 'src/view/actions/keyboard-shortcuts/helpers/commands/commands/helpers/save-node-content';

const viewEffectsAndActions = (
    view: LineageView,
    action: DocumentStoreAction | ViewStoreAction | undefined,
    initialRun: boolean | undefined,
    fromDocument: boolean,
) => {
    const documentStore = view.documentStore;
    const documentState = documentStore.getValue();
    const viewStore = view.viewStore;
    const viewState = viewStore.getValue();
    const settings = view.plugin.settings.getValue();
    const container = view.container;
    if (initialRun) {
        // actions
        setActiveNode(viewStore, documentState);
        updateActiveBranch(viewStore, documentState);
        if (view.isActive && isEmptyDocument(documentState.document.content)) {
            enableEditMode(viewStore, documentState);
        }
        updateStatusBar(view);
        // effects
        if (view.isActive && container) {
            focusContainer(view);
            alignBranchDebounced(
                documentState,
                viewState,
                container,
                settings,
                undefined,
                true,
            );
        }
    } else if (action) {
        const type = action.type;

        const e: (DocumentEventType & ViewEventType) | null = fromDocument
            ? getDocumentEventType(type as DocumentStoreAction['type'])
            : getViewEventType(type as ViewStoreAction['type']);
        if (!e) return;
        if (type === 'DOCUMENT/LOAD_FILE') {
            // needed when the file was modified externally
            // to prevent saving a node with an obsolete node-id
            // ideally the user should confirm this
            discardChanges(view);
        }
        const structuralChange =
            e.createOrDelete || e.dropOrMove || e.changeHistory || e.clipboard;
        const activeNodeChange = e.activeNode || e.activeNodeHistory;
        // actions
        if (structuralChange) {
            setActiveNode(viewStore, documentState);
        }
        if (activeNodeChange || structuralChange) {
            updateActiveBranch(viewStore, documentState);
        }

        if (type === 'DOCUMENT/INSERT_NODE' && view.isActive) {
            enableEditMode(viewStore, documentState);
        }

        if (
            type === 'DOCUMENT/DELETE_NODE' ||
            type === 'DOCUMENT/CUT_NODE' ||
            e.changeHistory ||
            type === 'DOCUMENT/EXTRACT_BRANCH' ||
            type === 'DOCUMENT/LOAD_FILE'
        ) {
            removeObsoleteNavigationItems(viewStore, documentState);
        }

        if (action.type === 'SEARCH/SET_QUERY') {
            updateSearchResults(documentStore, viewStore);
        }
        if (action.type === 'UI/TOGGLE_HELP_SIDEBAR') {
            if (viewState.ui.controls.showHelpSidebar)
                setTimeout(() => {
                    hotkeyStore.dispatch({
                        type: 'SET_CONFLICTING_HOTKEYS',
                        payload: {
                            conflictingHotkeys: getUsedHotkeys(view.plugin),
                        },
                    });
                }, 50);
        }

        // effects
        if (!container || !view.isViewOfFile) return;
        const postInlineEditor = type === 'DOCUMENT/CONFIRM_DISABLE_EDIT';
        if (e.content || structuralChange || postInlineEditor) {
            const maybeViewIsClosing = !view.isActive;
            view.saveDocument(maybeViewIsClosing, postInlineEditor);
        }

        if (e.zoom) {
            applyZoom(viewState, container, true);
        }
        if (
            e.content ||
            structuralChange ||
            type === 'SEARCH/TOGGLE_FUZZY_MODE'
        ) {
            resetSearchFuse(documentStore);
        }
        if (structuralChange) {
            updateStatusBar(view);
        }
        if (
            action.type === 'DOCUMENT/DISABLE_EDIT_MODE' ||
            e.content ||
            structuralChange ||
            action.type === 'SEARCH/TOGGLE_INPUT'
        ) {
            focusContainer(view);
        }
        if (
            activeNodeChange ||
            e.zoom ||
            e.search ||
            structuralChange ||
            e.content
        ) {
            const skipAligning =
                action.type === 'DOCUMENT/SET_ACTIVE_NODE' &&
                action.context?.modKey;
            if (!skipAligning)
                alignBranchDebounced(
                    documentStore.getValue(),
                    viewState,
                    container,
                    settings,
                    type === 'DOCUMENT/MOVE_NODE' ? 'instant' : undefined,
                );
        }
    }
};

export const viewSubscriptions = (view: LineageView) => {
    const unsubFromDocument = view.documentStore.subscribe(
        (documentState, action) => {
            viewEffectsAndActions(view, action, false, true);
        },
    );

    const unsubFromView = view.viewStore.subscribe(
        (viewState, action, initialRun) => {
            viewEffectsAndActions(view, action, initialRun, false);
        },
    );

    const unsubFromDocuments = view.plugin.documents.subscribe((_, action) => {
        if (!action) return;
        if (!view.container) return;
        if (action.type === 'WORKSPACE/ACTIVE_LEAF_CHANGE') {
            if (view.viewStore.getValue().document.editing.activeNodeId) {
                saveNodeContent(view);
            }
        }
        if (
            view.isActive &&
            (action.type === 'WORKSPACE/SET_ACTIVE_LINEAGE_VIEW' ||
                action.type === 'WORKSPACE/RESIZE')
        ) {
            focusContainer(view);
            alignBranchDebounced(
                view.documentStore.getValue(),
                view.viewStore.getValue(),
                view.container,
                view.plugin.settings.getValue(),
            );
        }
    });

    const unsubFromSettings = view.plugin.settings.subscribe(
        (state, action, isInitialRun) => {
            if (!view.container) return;
            if (isInitialRun) {
                applyFontSize(view, state.view.fontSize);
                applyContainerBg(view, state.view.theme.containerBg);
                applyActiveBranchBg(view, state.view.theme.activeBranchBg);
                applyCardWidth(view, state.view.cardWidth);
            } else if (action) {
                const type = action.type;
                if (type === 'SET_FONT_SIZE') {
                    applyFontSize(view, state.view.fontSize);
                } else if (type === 'SET_CONTAINER_BG') {
                    applyContainerBg(view, state.view.theme.containerBg);
                } else if (type === 'SET_ACTIVE_BRANCH_BG') {
                    applyActiveBranchBg(view, state.view.theme.activeBranchBg);
                } else if (type === 'SET_CARD_WIDTH') {
                    applyCardWidth(view, state.view.cardWidth);
                } else if (
                    view.isActive &&
                    (type === 'SET_HORIZONTAL_SCROLLING_MODE' ||
                        type === 'UPDATE_AXIS_OFFSET')
                ) {
                    alignBranchDebounced(
                        view.documentStore.getValue(),
                        view.viewStore.getValue(),
                        view.container,
                        state,
                        'instant',
                    );
                    if (
                        type === 'SET_HORIZONTAL_SCROLLING_MODE' &&
                        state.view.scrolling.horizontalScrollingMode ===
                            'fixed-position'
                    ) {
                        new Notice('Hold space to change card position');
                    }
                }
            }
        },
    );

    return () => {
        unsubFromDocument();
        unsubFromView();
        unsubFromSettings();
        unsubFromDocuments();
    };
};
