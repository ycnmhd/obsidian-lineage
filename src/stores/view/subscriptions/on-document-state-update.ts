import { LineageView } from 'src/view/view';
import { DocumentStoreAction } from 'src/stores/document/document-store-actions';
import { getDocumentEventType } from 'src/stores/view/helpers/get-document-event-type';
import { setActiveNode } from 'src/stores/view/subscriptions/actions/set-active-node';
import { enableEditMode } from 'src/stores/view/subscriptions/actions/enable-edit-mode';
import { removeObsoleteNavigationItems } from 'src/stores/view/subscriptions/actions/remove-obsolete-navigation-items';
import { focusContainer } from 'src/stores/view/subscriptions/effects/focus-container';
import { persistPinnedNodes } from 'src/stores/view/subscriptions/actions/persist-pinned-nodes';
import { updateStaleActivePinnedNode } from 'src/stores/view/subscriptions/actions/update-stale-active-pinned-node';
import { setActivePinnedNode } from 'src/stores/view/subscriptions/actions/set-active-pinned-node';
import { updateSelectedNodes } from 'src/stores/view/subscriptions/actions/update-selected-nodes';

export const onDocumentStateUpdate = (
    view: LineageView,
    action: DocumentStoreAction,
) => {
    const documentStore = view.documentStore;
    const documentState = documentStore.getValue();
    const viewStore = view.viewStore;
    const container = view.container;

    viewStore.setContext(documentState.document);
    const type = action.type;

    const e = getDocumentEventType(type);
    if (type === 'document/file/load-from-disk') {
        // needed when the file was modified externally
        // to prevent saving a node with an obsolete node-id
        view.inlineEditor.unloadNode();
    }

    const structuralChange =
        e.createOrDelete || e.dropOrMove || e.changeHistory || e.clipboard;
    if (structuralChange) {
        setActiveNode(view, action);

        viewStore.dispatch({
            type: 'view/update-active-branch?source=document',
            context: {
                documentAction: action,
            },
        });
        viewStore.dispatch({
            type: 'view/outline/refresh-collapsed-nodes',
        });
        documentStore.dispatch({
            type: 'document/pinned-nodes/remove-stale-nodes',
        });
        documentStore.dispatch({
            type: 'document/meta/refresh-group-parent-ids',
        });
    }

    if (structuralChange && type !== 'document/move-node') {
        updateSelectedNodes(view, action, e.changeHistory!);
    }

    if (type === 'document/add-node' && view.isActive) {
        enableEditMode(viewStore, documentState);
    }

    if (
        type === 'document/delete-node' ||
        type === 'document/cut-node' ||
        e.changeHistory ||
        type === 'document/extract-node' ||
        type === 'document/file/load-from-disk' ||
        type === 'document/split-node'
    ) {
        removeObsoleteNavigationItems(viewStore, documentState);
    }

    // effects
    if (e.content) {
        view.alignBranch.align(action);
    }
    if (structuralChange || e.content) {
        view.rulesProcessor.onDocumentUpdate(action);
    }

    // Save gate. Originally this also required `view.isViewOfFile` (i.e. the
    // view whose id matches the document-store owner registered on
    // `active-leaf-change`). Views opened in detached/embedded leaves - e.g. a
    // dashboard popover - are never the active leaf, so that check silently
    // dropped their edits. Only the container guard is needed to persist.
    if (!container) return;

    if (e.content || structuralChange) {
        view.saveDocument();
    }

    if (e.content || structuralChange) {
        if (view.minimapStore) {
            view.minimapEffects.drawDocument(view);
        }

        view.documentSearch.resetIndex();
        const query = viewStore.getValue().search.query;
        if (query) {
            view.viewStore.dispatch({
                type: 'view/search/set-query',
                payload: {
                    query,
                },
            });
        }
    }
    if (structuralChange) {
        view.plugin.statusBar.updateAll(view);
    }

    if (e.content || structuralChange) {
        if (view.isActive) focusContainer(view);
    }

    const pinnedNodesUpdate =
        type === 'document/pinned-nodes/remove-stale-nodes' ||
        type === 'document/pinned-nodes/pin' ||
        type === 'document/pinned-nodes/unpin';

    if (pinnedNodesUpdate) {
        persistPinnedNodes(view);
    }
    if (
        pinnedNodesUpdate ||
        type === 'document/pinned-nodes/load-from-settings'
    ) {
        if (type === 'document/pinned-nodes/pin') {
            setActivePinnedNode(view, action.payload.id);
        } else {
            updateStaleActivePinnedNode(view);
        }
    }
};
