import { LineageView } from 'src/view/view';
import { setActivePinnedNode } from 'src/stores/view/subscriptions/actions/set-active-pinned-node';
import { getCategoryEntries } from 'src/view/components/global-categories/helpers/tree-utils';

export const loadPinnedNodesToDocument = (view: LineageView) => {
    const documentStore = view.documentStore;
    const documentState = documentStore.getValue();
    const settingsStore = view.plugin.settings;
    const settingsState = settingsStore.getValue();
    const persistedDocuments = settingsState.documents;
    const persistedDocument = persistedDocuments[view.file!.path];

    if (!persistedDocument?.pinnedSections) return;

    if (persistedDocument.pinnedSections.sections.length === 0) {
        const activeLeftSideTab = settingsState.view.leftSidebarActiveTab;
        const viewState = view.viewStore.getValue();
        const showLeftSidebar = viewState.ui.controls.showLeftSidebar;
        if (showLeftSidebar && activeLeftSideTab === 'pinned-cards') {
            view.viewStore.dispatch({ type: 'view/left-sidebar/toggle' });
        }
        return;
    }
    // Always re-sync pinned nodes from the persisted section references on
    // view mount. Pinned node ids are random per load and get remapped by
    // section number; a reused store (e.g. one created earlier as a background
    // store by the global categories view, or one that was reloaded before
    // this view's subscriptions attached) may hold stale ids otherwise.
    documentStore.dispatch({
        type: 'document/pinned-nodes/load-from-settings',
        payload: {
            sections: persistedDocument.pinnedSections.sections,
            fileCategories:
                persistedDocument.pinnedSections.fileCategories || [],
            nodeToCategory:
                persistedDocument.pinnedSections.nodeToCategory || {},
        },
    });
    const activeSection = persistedDocument.pinnedSections.activeSection;
    if (activeSection) {
        const id = documentState.sections.section_id[activeSection];
        if (id) {
            setActivePinnedNode(view, id);
        }
    }
    // Load active category (skip global categories while the feature is
    // disabled — they aren't selectable anymore)
    const activeCategory = persistedDocument.pinnedSections.activeCategory;
    if (activeCategory) {
        const globalPaths = new Set(
            getCategoryEntries(settingsState.categories.tree).map(
                (e) => e.path,
            ),
        );
        const isGlobalCategory =
            activeCategory !== 'all' &&
            activeCategory !== 'uncategorized' &&
            globalPaths.has(activeCategory);
        if (!isGlobalCategory || settingsState.categories.globalCategoriesEnabled) {
            view.viewStore.dispatch({
                type: 'view/pinned-nodes/set-active-category',
                payload: { category: activeCategory },
            });
        }
    }
};
