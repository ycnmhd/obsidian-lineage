import {
    PinnedNodesState,
    Sections,
} from 'src/stores/document/document-state-type';

export type LoadPinnedNodesAction = {
    type: 'document/pinned-nodes/load-from-settings';
    payload: {
        sections: string[];
        fileCategories: string[];
        nodeToCategory: Record<string, string>;
    };
};

export const loadPinnedNodes = (
    pinnedNodes: PinnedNodesState,
    sections: Sections,
    payload: {
        sections: string[];
        fileCategories: string[];
        nodeToCategory: Record<string, string>;
    },
) => {
    pinnedNodes.Ids = payload.sections
        .map((section) => sections.section_id[section])
        .filter((x) => x);
    pinnedNodes.fileCategories = payload.fileCategories;
    // Convert section-based nodeToCategory to node-id based
    pinnedNodes.nodeToCategory = {};
    for (const [section, category] of Object.entries(payload.nodeToCategory)) {
        const nodeId = sections.section_id[section];
        if (nodeId) {
            pinnedNodes.nodeToCategory[nodeId] = category;
        }
    }
};
