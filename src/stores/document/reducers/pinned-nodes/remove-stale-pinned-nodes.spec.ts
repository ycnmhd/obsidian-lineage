import { describe, it, expect } from 'vitest';
import { removeStalePinnedNodes } from './remove-stale-pinned-nodes';
import { PinnedNodesState, Sections } from 'src/stores/document/document-state-type';

describe('removeStalePinnedNodes', () => {
    const createPinnedNodes = (
        ids: string[],
        nodeToCategory: Record<string, string> = {},
    ): PinnedNodesState => ({
        Ids: ids,
        nodeToCategory,
        fileCategories: [],
    });

    const createSections = (
        idSection: Record<string, string>,
        sectionId: Record<string, string>,
    ): Sections => ({
        id_section: idSection,
        section_id: sectionId,
    });

    it('should keep pinned nodes that still exist (normal case)', () => {
        const pinnedNodes = createPinnedNodes(['n1', 'n2', 'n3']);
        const sections = createSections(
            { n1: '1', n2: '2', n3: '3' },
            { '1': 'n1', '2': 'n2', '3': 'n3' },
        );

        removeStalePinnedNodes(pinnedNodes, sections);

        expect(pinnedNodes.Ids).toEqual(['n1', 'n2', 'n3']);
    });

    it('should remove pinned nodes that no longer exist (normal case)', () => {
        const pinnedNodes = createPinnedNodes(['n1', 'n2', 'n3']);
        // n2 no longer exists
        const sections = createSections(
            { n1: '1', n3: '3' },
            { '1': 'n1', '3': 'n3' },
        );

        removeStalePinnedNodes(pinnedNodes, sections);

        expect(pinnedNodes.Ids).toEqual(['n1', 'n3']);
    });

    it('should remap pinned nodes by section number when file is reloaded', () => {
        // Old pinned nodes with random IDs
        const pinnedNodes = createPinnedNodes(['nOld1', 'nOld2', 'nOld3']);
        // Old sections (before reload)
        const oldSections = createSections(
            { nOld1: '1', nOld2: '2', nOld3: '3' },
            { '1': 'nOld1', '2': 'nOld2', '3': 'nOld3' },
        );
        // New sections (after reload) with new random IDs
        const newSections = createSections(
            { nNew1: '1', nNew2: '2', nNew3: '3' },
            { '1': 'nNew1', '2': 'nNew2', '3': 'nNew3' },
        );

        removeStalePinnedNodes(pinnedNodes, newSections, oldSections);

        // Pinned nodes should be remapped to new IDs
        expect(pinnedNodes.Ids).toEqual(['nNew1', 'nNew2', 'nNew3']);
    });

    it('should remove pinned nodes whose section was deleted on reload', () => {
        const pinnedNodes = createPinnedNodes(['nOld1', 'nOld2', 'nOld3']);
        // Old sections (before reload)
        const oldSections = createSections(
            { nOld1: '1', nOld2: '2', nOld3: '3' },
            { '1': 'nOld1', '2': 'nOld2', '3': 'nOld3' },
        );
        // New sections (after reload) - section 2 was deleted
        const newSections = createSections(
            { nNew1: '1', nNew3: '3' },
            { '1': 'nNew1', '3': 'nNew3' },
        );

        removeStalePinnedNodes(pinnedNodes, newSections, oldSections);

        expect(pinnedNodes.Ids).toEqual(['nNew1', 'nNew3']);
    });

    it('should remap nodeToCategory by section number when file is reloaded', () => {
        const pinnedNodes = createPinnedNodes(
            ['nOld1', 'nOld2'],
            { nOld1: 'categoryA', nOld2: 'categoryB' },
        );
        const oldSections = createSections(
            { nOld1: '1', nOld2: '2' },
            { '1': 'nOld1', '2': 'nOld2' },
        );
        const newSections = createSections(
            { nNew1: '1', nNew2: '2' },
            { '1': 'nNew1', '2': 'nNew2' },
        );

        removeStalePinnedNodes(pinnedNodes, newSections, oldSections);

        expect(pinnedNodes.nodeToCategory).toEqual({
            nNew1: 'categoryA',
            nNew2: 'categoryB',
        });
    });

    it('should clean up nodeToCategory for deleted nodes on reload', () => {
        const pinnedNodes = createPinnedNodes(
            ['nOld1', 'nOld2'],
            { nOld1: 'categoryA', nOld2: 'categoryB' },
        );
        const oldSections = createSections(
            { nOld1: '1', nOld2: '2' },
            { '1': 'nOld1', '2': 'nOld2' },
        );
        // Section 2 was deleted
        const newSections = createSections(
            { nNew1: '1' },
            { '1': 'nNew1' },
        );

        removeStalePinnedNodes(pinnedNodes, newSections, oldSections);

        expect(pinnedNodes.nodeToCategory).toEqual({
            nNew1: 'categoryA',
        });
    });
});
