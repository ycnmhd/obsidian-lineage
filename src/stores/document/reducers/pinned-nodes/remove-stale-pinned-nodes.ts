import {
    PinnedNodesState,
    Sections,
} from 'src/stores/document/document-state-type';

import { sortNodeIdsBySectionNumber } from 'src/lib/tree-utils/sort/sort-node-ids-by-section-number';

export type RemoveStalePinnedNodesAction = {
    type: 'document/pinned-nodes/remove-stale-nodes';
    payload?: {
        oldSections: Sections;
    };
};

export const removeStalePinnedNodes = (
    pinnedNodes: PinnedNodesState,
    sections: Sections,
    oldSections?: Sections,
) => {
    let newPinnedIds: string[];

    if (oldSections) {
        // Remap pinned nodes by section number when file is reloaded
        // (node IDs are random and change on each reload)
        newPinnedIds = pinnedNodes.Ids
            .map((oldNodeId) => {
                const sectionNumber = oldSections.id_section[oldNodeId];
                if (!sectionNumber) return null;
                return sections.section_id[sectionNumber] || null;
            })
            .filter((id): id is string => id !== null);
    } else {
        // Normal case: just filter out nodes that no longer exist
        newPinnedIds = pinnedNodes.Ids.filter((id) => sections.id_section[id]);
    }

    pinnedNodes.Ids = sortNodeIdsBySectionNumber(sections, newPinnedIds);

    // Remap nodeToCategory by section number when file is reloaded
    if (oldSections) {
        const newCategoryMap: Record<string, string> = {};
        for (const [oldNodeId, category] of Object.entries(
            pinnedNodes.nodeToCategory,
        )) {
            const sectionNumber = oldSections.id_section[oldNodeId];
            if (!sectionNumber) continue;
            const newNodeId = sections.section_id[sectionNumber];
            if (newNodeId) {
                newCategoryMap[newNodeId] = category;
            }
        }
        pinnedNodes.nodeToCategory = newCategoryMap;
    } else {
        // Clean up stale category mappings for deleted nodes
        for (const nodeId of Object.keys(pinnedNodes.nodeToCategory)) {
            if (!sections.id_section[nodeId]) {
                delete pinnedNodes.nodeToCategory[nodeId];
            }
        }
    }
};
