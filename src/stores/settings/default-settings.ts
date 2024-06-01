import { Settings } from './settings-type';

export const DEFAULT_CARD_WIDTH = 550;
export const DEFAULT_SETTINGS = (): Settings => ({
    documents: {},
    hotkeys: {
        customHotkeys: {},
    },
    view: {
        fontSize: 16,
        theme: {},
        cardWidth: DEFAULT_CARD_WIDTH,
        scrolling: {
            horizontalOffset: 0,
            verticalOffset: 0,
            horizontalScrollingMode: 'keep-active-card-at-center',
        },
        limitPreviewHeight: true,
        zoomLevel: 1,
    },
    backup: {},
});
