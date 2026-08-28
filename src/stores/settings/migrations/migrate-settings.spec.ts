import { describe, expect, it } from 'vitest';
import { migrateSettings } from 'src/stores/settings/migrations/migrate-settings';
import { Settings } from 'src/stores/settings/settings-type';

const buildLegacySettings = () =>
    ({
        documents: {},
        hotkeys: { customHotkeys: {} },
        categories: { globalCategories: ['Davidson', 'Quine'] },
        view: {
            fontSize: 16,
            h1FontSize_em: 1.802,
            theme: { inactiveNodeOpacity: 25 },
            cardWidth: 550,
            cardsGap: 50,
            scrolling: { centerActiveNodeH: false, centerActiveNodeV: true },
            limitPreviewHeight: true,
            zoomLevel: 1,
            showMinimap: false,
            leftSidebarWidth: 500,
            leftSidebarActiveTab: 'pinned-cards',
            applyGapBetweenCards: false,
            outlineMode: false,
            mindmapMode: false,
            nodeIndentationWidth: 60,
            maintainEditMode: false,
            alwaysShowCardButtons: false,
            hiddenVerticalToolbarButtons: [],
        },
        general: { defaultDocumentFormat: 'sections', linkPaneType: 'tab' },
        styleRules: {
            documents: {},
            global: { rules: [] },
            settings: { activeTab: 'global-rules' },
        },
    }) as unknown as Settings;

describe('migrateSettings → global categories', () => {
    it('converts the flat globalCategories list into root-level category nodes', () => {
        const settings = buildLegacySettings();
        migrateSettings(settings);

        const tree = settings.categories.tree;
        expect(tree).toHaveLength(2);
        expect(tree.map((n) => n.name)).toEqual(['Davidson', 'Quine']);
        for (const node of tree) {
            expect(node.type).toBe('category');
            expect(node.parentId).toBeNull();
            expect(node.children).toEqual([]);
            expect(node.id.startsWith('gc')).toBe(true);
        }
        expect(settings.categories.globalCards).toEqual({});
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expect((settings.categories as any).globalCategories).toBeUndefined();
    });

    it('leaves the tree untouched when no legacy categories exist', () => {
        const settings = {
            ...buildLegacySettings(),
            categories: { tree: [], globalCards: {} },
        } as unknown as Settings;
        migrateSettings(settings);
        expect(settings.categories.tree).toEqual([]);
        expect(settings.categories.globalCards).toEqual({});
    });
});
