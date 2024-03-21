import { DocumentStore, ViewStore } from 'src/view/view';
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
import { setTreeIndex } from 'src/stores/view/subscriptions/actions/set-tree-index';
import { resetSearchFuse } from 'src/stores/view/subscriptions/actions/update-search-results/helpers/reset-search-fuse';
import { applyZoom } from 'src/stores/view/subscriptions/effects/apply-zoom';
import { ViewStoreAction } from 'src/stores/view/view-store-actions';
import { isEmptyDocument } from 'src/stores/view/subscriptions/helpers/is-empty-document';

const viewEffectsAndActions = (
    documentStore: DocumentStore,
    viewStore: ViewStore,
    action: DocumentStoreAction | ViewStoreAction | undefined,
    initialRun: boolean | undefined,
    fromDocument: boolean,
    container: HTMLElement,
    save: () => void,
) => {
    const documentState = documentStore.getValue();
    const viewState = viewStore.getValue();
    if (initialRun) {
        // actions
        setTreeIndex(viewStore, documentState);
        setActiveNode(viewStore, documentState);
        updateActiveBranch(viewStore, documentState);
        if (isEmptyDocument(documentState.document.content)) {
            enableEditMode(viewStore, documentState);
        }
        // effects
        alignBranchDebounced(documentState, viewState, container);
    } else if (action) {
        const type = action.type;

        const e: (DocumentEventType & ViewEventType) | null = fromDocument
            ? getDocumentEventType(type as DocumentStoreAction['type'])
            : getViewEventType(type as ViewStoreAction['type']);
        if (!e) return;

        // actions
        if (e.creationAndDeletion || e.shape || e.changeHistory) {
            setTreeIndex(viewStore, documentState);
            setActiveNode(viewStore, documentState);
        }

        if (type === 'DOCUMENT/INSERT_NODE') {
            enableEditMode(viewStore, documentState);
        }

        if (type === 'DOCUMENT/DELETE_NODE') {
            removeObsoleteNavigationItems(viewStore, documentState);
        }

        if (
            e.activeNode ||
            e.activeNodeHistory ||
            e.creationAndDeletion ||
            e.shape ||
            e.changeHistory
        ) {
            updateActiveBranch(viewStore, documentState);
        }

        if (action.type === 'SEARCH/SET_QUERY') {
            updateSearchResults(documentStore, viewStore);
        }

        // effects
        if (e.changeHistory || e.content || e.creationAndDeletion || e.shape) {
            resetSearchFuse(documentStore);
            save();
        }
        if (action.type === 'DOCUMENT/DISABLE_EDIT_MODE') {
            focusContainer(container);
        }

        if (e.zoom) {
            applyZoom(container, viewState);
        }
        if (type === 'DOCUMENT/MOVE_NODE') {
            focusContainer(container);
        }
        if (
            e.activeNode ||
            e.activeNodeHistory ||
            e.zoom ||
            e.search ||
            e.creationAndDeletion ||
            e.shape ||
            e.changeHistory
        ) {
            alignBranchDebounced(
                documentStore.getValue(),
                viewState,
                container,
            );
        }
    }
};

export const viewSubscriptions = (
    documentStore: DocumentStore,
    viewStore: ViewStore,
    container: HTMLElement,
    save: () => void,
) => {
    const unsubFromDocument = documentStore.subscribe(
        (documentState, action) => {
            viewEffectsAndActions(
                documentStore,
                viewStore,
                action,
                false,
                true,
                container,
                save,
            );
        },
    );

    const unsubFromView = viewStore.subscribe(
        (viewState, action, initialRun) => {
            viewEffectsAndActions(
                documentStore,
                viewStore,
                action,
                initialRun,
                false,
                container,
                save,
            );
        },
    );

    return () => {
        unsubFromDocument();
        unsubFromView();
    };
};
