import { LineageView } from 'src/view/view';

export const persistPinnedNodes = (view: LineageView) => {
    const documentState = view.documentStore.getValue();
    const viewState = view.viewStore.getValue();
    const pinnedNodes = documentState.pinnedNodes;
    const sections = documentState.sections;
    const pinnedSections = pinnedNodes.Ids.map((id) => sections.id_section[id]);
    const section = sections.id_section[viewState.pinnedNodes.activeNode];

    // Convert node-id based nodeToCategory to section-based for persistence
    const sectionToCategory: Record<string, string> = {};
    for (const [nodeId, category] of Object.entries(pinnedNodes.nodeToCategory)) {
        const sectionContent = sections.id_section[nodeId];
        if (sectionContent) {
            sectionToCategory[sectionContent] = category;
        }
    }

    view.plugin.settings.dispatch({
        type: 'settings/pinned-nodes/persist',
        payload: {
            sections: pinnedSections,
            filePath: view.file!.path,
            section,
            fileCategories: pinnedNodes.fileCategories,
            nodeToCategory: sectionToCategory,
            activeCategory: viewState.pinnedNodes.activeCategory,
        },
    });
};
