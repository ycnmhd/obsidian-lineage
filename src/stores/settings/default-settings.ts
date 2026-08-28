import { Settings } from './settings-type';

export const DEFAULT_CARD_WIDTH = 550;
export const DEFAULT_CARDS_GAP = 50;
export const DEFAULT_INDENTATION_WIDTH = 60;
export const DEFAULT_INACTIVE_NODE_OPACITY = 25;
export const DEFAULT_H1_FONT_SIZE_EM = 1.802;
export const DEFAULT_SETTINGS = (): Settings => ({
    documents: {},
    hotkeys: {
        customHotkeys: {},
    },
    categories: {
        tree: [],
        globalCards: {},
        globalCategoriesEnabled: true,
    },
    view: {
        fontSize: 16,
        h1FontSize_em: DEFAULT_H1_FONT_SIZE_EM,
        theme: {
            inactiveNodeOpacity: DEFAULT_INACTIVE_NODE_OPACITY,
        },
        cardWidth: DEFAULT_CARD_WIDTH,
        cardsGap: DEFAULT_CARDS_GAP,
        scrolling: {
            centerActiveNodeH: false,
            centerActiveNodeV: true,
        },
        limitPreviewHeight: true,
        zoomLevel: 1,
        showMinimap: false,
        leftSidebarWidth: 500,
        leftSidebarActiveTab: 'pinned-cards',
        applyGapBetweenCards: false,
        outlineMode: false,
        mindmapMode: false,
        nodeIndentationWidth: DEFAULT_INDENTATION_WIDTH,
        maintainEditMode: false,
        alwaysShowCardButtons: false,
        hiddenVerticalToolbarButtons: [],
    },
    general: {
        defaultDocumentFormat: 'sections',
        linkPaneType: 'tab',
    },
    styleRules: {
        documents: {},
        global: {
            rules: [],
        },
        settings: {
            activeTab: 'global-rules',
        },
    },
});
