import { Settings } from './settings-type';
import { changeZoomLevel } from 'src/stores/settings/reducers/change-zoom-level';
import { updateStyleRules } from 'src/stores/settings/reducers/update-style-rules/update-style-rules';
import { CommandName } from 'src/lang/hotkey-groups';
import { toggleEditorState } from 'src/stores/settings/reducers/toggle-editor-state';
import { setHotkeyAsBlank } from 'src/stores/settings/reducers/set-hotkey-as-blank';
import { PersistedViewHotkey } from 'src/view/actions/keyboard-shortcuts/helpers/commands/default-view-hotkeys';
import { persistCollapsedSections } from 'src/stores/settings/reducers/persist-collapsed-sections';
import { SettingsActions } from 'src/stores/settings/settings-store-actions';
import {
    addGlobalCard,
    createGlobalNode,
    deleteGlobalNode,
    moveGlobalCard,
    moveGlobalNode,
    removeGlobalCard,
    renameGlobalNode,
    setGlobalCategoriesEnabled,
} from 'src/stores/settings/reducers/global-categories/global-categories-reducer';

const updateState = (store: Settings, action: SettingsActions) => {
    if (action.type === 'settings/documents/delete-document-preferences') {
        delete store.documents[action.payload.path];
        delete store.styleRules.documents[action.payload.path];
    } else if (action.type === 'settings/documents/set-document-format') {
        if (!store.documents[action.payload.path]) {
            store.documents[action.payload.path] = {
                documentFormat: action.payload.format,
                viewType: 'lineage',
                activeSection: null,
                pinnedSections: {
                    sections: [],
                    activeSection: null,
                    fileCategories: [],
                    nodeToCategory: {},
                    activeCategory: 'all',
                },
                outline: {
                    collapsedSections: [],
                },
            };
        } else {
            store.documents[action.payload.path].documentFormat =
                action.payload.format;
        }
    } else if (action.type === 'settings/documents/set-view-type') {
        if (store.documents[action.payload.path]) {
            store.documents[action.payload.path].viewType = action.payload.type;
        }
    } else if (action.type === 'settings/document/persist-active-section') {
        if (store.documents[action.payload.path]) {
            store.documents[action.payload.path].activeSection =
                action.payload.sectionNumber;
        }
    } else if (action.type === 'settings/documents/update-document-path') {
        const preferences = store.documents[action.payload.oldPath];
        delete store.documents[action.payload.oldPath];
        store.documents[action.payload.newPath] = preferences;

        if (store.styleRules.documents[action.payload.oldPath]) {
            const rules = store.styleRules.documents[action.payload.oldPath];
            delete store.styleRules.documents[action.payload.oldPath];
            store.styleRules.documents[action.payload.newPath] = rules;
        }
    } else if (action.type === 'settings/hotkeys/update-custom-hotkeys') {
        store.hotkeys.customHotkeys = action.payload.customHotkeys;
    } else if (action.type === 'settings/view/theme/set-font-size') {
        store.view.fontSize = action.payload.fontSize;
    } else if (action.type === 'settings/view/theme/set-h1-font-size') {
        store.view.h1FontSize_em = action.payload.fontSize_em;
    } else if (action.type === 'settings/view/theme/set-container-bg-color') {
        store.view.theme.containerBg = action.payload.backgroundColor;
    } else if (
        action.type === 'settings/view/theme/set-active-branch-bg-color'
    ) {
        store.view.theme.activeBranchBg = action.payload.backgroundColor;
    } else if (action.type === 'settings/view/layout/set-card-width') {
        store.view.cardWidth = action.payload.width;
    } else if (action.type === 'settings/view/layout/set-min-card-height') {
        store.view.minimumCardHeight = action.payload.height;
    } else if (action.type === 'settings/view/layout/set-limit-card-height') {
        store.view.limitPreviewHeight = action.payload.limit;
    } else if (action.type === 'settings/documents/remove-stale-documents') {
        store.documents = { ...action.payload.documents };
    } else if (action.type === 'settings/view/set-zoom-level') {
        changeZoomLevel(store, action.payload);
    } else if (action.type === 'settings/general/set-default-document-format') {
        store.general.defaultDocumentFormat = action.payload.format;
    } else if (action.type === 'settings/view/toggle-minimap') {
        store.view.showMinimap = !store.view.showMinimap;
    } else if (action.type === 'settings/pinned-nodes/persist') {
        const document = store.documents[action.payload.filePath];
        if (!document.pinnedSections) {
            document.pinnedSections = {
                sections: [],
                activeSection: null,
                fileCategories: [],
                nodeToCategory: {},
                activeCategory: 'all',
            };
        }
        document.pinnedSections.sections = action.payload.sections;
        document.pinnedSections.activeSection = action.payload.section;
        document.pinnedSections.fileCategories = action.payload.fileCategories;
        document.pinnedSections.nodeToCategory = action.payload.nodeToCategory;
        document.pinnedSections.activeCategory = action.payload.activeCategory;
    } else if (action.type === 'settings/pinned-nodes/persist-active-node') {
        const document = store.documents[action.payload.filePath];
        if (!document.pinnedSections) {
            document.pinnedSections = {
                sections: [],
                activeSection: null,
                fileCategories: [],
                nodeToCategory: {},
                activeCategory: 'all',
            };
        }
        document.pinnedSections.activeSection = action.payload.section;
    } else if (
        action.type === 'settings/view/toggle-horizontal-scrolling-mode'
    ) {
        store.view.scrolling.centerActiveNodeH =
            !store.view.scrolling.centerActiveNodeH;

        store.view.scrolling = {
            ...store.view.scrolling,
        };
    } else if (action.type === 'settings/view/toggle-vertical-scrolling-mode') {
        store.view.scrolling.centerActiveNodeV =
            !store.view.scrolling.centerActiveNodeV;
        store.view.scrolling = {
            ...store.view.scrolling,
        };
    } else if (action.type === 'settings/view/layout/set-cards-gap') {
        store.view.cardsGap = action.payload.gap;
    } else if (action.type === 'view/left-sidebar/set-width') {
        if (action.payload.width > 0) {
            store.view.leftSidebarWidth = action.payload.width;
        }
    } else if (action.type === 'view/left-sidebar/set-active-tab') {
        store.view.leftSidebarActiveTab = action.payload.tab;
    } else if (action.type === 'view/modes/gap-between-cards/toggle') {
        store.view.applyGapBetweenCards = !store.view.applyGapBetweenCards;
    } else if (action.type === 'settings/view/modes/toggle-outline-mode') {
        store.view.outlineMode = !store.view.outlineMode;
        if (store.view.outlineMode) {
            store.view.scrolling.centerActiveNodeH = false;
            store.view.scrolling = {
                ...store.view.scrolling,
            };
        }
    } else if (action.type === 'settings/view/modes/toggle-mindmap-mode') {
        store.view.mindmapMode = !store.view.mindmapMode;
        if (store.view.mindmapMode) {
            store.view.outlineMode = false;
            store.view.scrolling.centerActiveNodeH = false;
            store.view.scrolling = {
                ...store.view.scrolling,
            };
        }
    } else if (action.type === 'settings/view/set-node-indentation-width') {
        store.view.nodeIndentationWidth = action.payload.width;
    } else if (action.type === 'settings/view/set-maintain-edit-mode') {
        store.view.maintainEditMode = action.payload.maintain;
    } else if (
        action.type === 'settings/view/theme/set-inactive-node-opacity'
    ) {
        store.view.theme.inactiveNodeOpacity = action.payload.opacity;
    } else if (action.type === 'settings/view/theme/set-active-branch-color') {
        if (action.payload.color) {
            store.view.theme.activeBranchColor = action.payload.color;
        } else {
            delete store.view.theme.activeBranchColor;
        }
    } else if (action.type === 'settings/hotkeys/set-custom-hotkey') {
        const customHotkey =
            store.hotkeys.customHotkeys[action.payload.command];
        if (!customHotkey) {
            store.hotkeys.customHotkeys[action.payload.command] = {
                [action.payload.type]: action.payload.hotkey,
            };
        } else {
            customHotkey[action.payload.type] = {
                ...customHotkey[action.payload.type],
                ...action.payload.hotkey,
            };
        }
        store.hotkeys.customHotkeys = { ...store.hotkeys.customHotkeys };
    } else if (action.type === 'settings/hotkeys/reset-custom-hotkey') {
        const customHotkey =
            store.hotkeys.customHotkeys[action.payload.command];
        if (customHotkey) {
            delete customHotkey[action.payload.type];
        }
        store.hotkeys.customHotkeys = { ...store.hotkeys.customHotkeys };
    } else if (action.type === 'settings/hotkeys/apply-preset') {
        const entries = Object.entries(action.payload.preset) as [
            command: CommandName,
            hotkeys: {
                primary?: PersistedViewHotkey;
                secondary?: PersistedViewHotkey;
            },
        ][];
        for (const [command, customHotkeys] of entries) {
            if (!store.hotkeys.customHotkeys[command]) {
                store.hotkeys.customHotkeys[command] = {};
            }
            if (customHotkeys.primary) {
                store.hotkeys.customHotkeys[command]!.primary =
                    customHotkeys.primary;
            }
            if (customHotkeys.secondary) {
                store.hotkeys.customHotkeys[command]!.secondary =
                    customHotkeys.secondary;
            }
        }
        store.hotkeys.customHotkeys = {
            ...store.hotkeys.customHotkeys,
        };
    } else if (action.type === 'settings/hotkeys/reset-all') {
        store.hotkeys.customHotkeys = {};
    } else if (action.type === 'settings/hotkeys/toggle-editor-state') {
        toggleEditorState(store, action);
    } else if (action.type === 'settings/hotkeys/set-blank') {
        setHotkeyAsBlank(store, action);
    } else if (action.type === 'settings/document/persist-collapsed-sections') {
        persistCollapsedSections(store, action);
    } else if (action.type === 'settings/view/set-always-show-card-buttons') {
        store.view.alwaysShowCardButtons = action.payload.show;
    } else if (
        action.type === 'settings/view/vertical-toolbar/set-hidden-button'
    ) {
        if (action.payload.hide) {
            store.view.hiddenVerticalToolbarButtons = Array.from(
                new Set([
                    ...store.view.hiddenVerticalToolbarButtons,
                    action.payload.id,
                ]),
            );
        } else {
            store.view.hiddenVerticalToolbarButtons =
                store.view.hiddenVerticalToolbarButtons.filter(
                    (b) => b !== action.payload.id,
                );
        }
    } else if (action.type === 'settings/style-rules/set-active-tab') {
        store.styleRules.settings.activeTab = action.payload.tab;
    } else if (action.type === 'settings/general/set-link-pane-type') {
        store.general.linkPaneType = action.payload.position;
    } else if (action.type === 'settings/categories/global/create-folder') {
        createGlobalNode(
            store.categories,
            action.payload.parentId,
            action.payload.name,
            'folder',
        );
    } else if (action.type === 'settings/categories/global/create-category') {
        createGlobalNode(
            store.categories,
            action.payload.parentId,
            action.payload.name,
            'category',
        );
    } else if (action.type === 'settings/categories/global/rename') {
        renameGlobalNode(store.categories, action.payload.id, action.payload.name);
    } else if (action.type === 'settings/categories/global/delete') {
        deleteGlobalNode(store.categories, action.payload.id);
    } else if (action.type === 'settings/categories/global/move') {
        moveGlobalNode(
            store.categories,
            action.payload.id,
            action.payload.newParentId,
            action.payload.index,
        );
    } else if (action.type === 'settings/categories/global/add-card') {
        addGlobalCard(
            store.categories,
            action.payload.categoryId,
            action.payload.filePath,
            action.payload.section,
        );
    } else if (action.type === 'settings/categories/global/remove-card') {
        removeGlobalCard(
            store.categories,
            action.payload.categoryId,
            action.payload.filePath,
            action.payload.section,
        );
    } else if (action.type === 'settings/categories/global/move-card') {
        moveGlobalCard(
            store.categories,
            action.payload.categoryId,
            action.payload.filePath,
            action.payload.section,
            action.payload.toIndex,
        );
    } else if (action.type === 'settings/categories/global/set-enabled') {
        setGlobalCategoriesEnabled(store.categories, action.payload.enabled);
    } else if (action.type.startsWith('settings/style-rules')) {
        updateStyleRules(store, action);
    }
};
export const settingsReducer = (
    store: Settings,
    action: SettingsActions,
): Settings => {
    updateState(store, action);
    return store;
};
