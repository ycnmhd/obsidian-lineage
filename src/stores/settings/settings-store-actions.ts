import {
    CustomHotkeys,
    DocumentPreferences,
    LeftSidebarTab,
    LineageDocumentFormat,
    LinkPaneType,
    RulesTab,
    ViewType,
} from 'src/stores/settings/settings-type';
import { ChangeZoomLevelAction } from 'src/stores/settings/reducers/change-zoom-level';
import { StyleRulesAction } from 'src/stores/settings/reducers/update-style-rules/update-style-rules';
import { ToolbarButton } from 'src/view/modals/vertical-toolbar-buttons/vertical-toolbar-buttons';
import { CommandName } from 'src/lang/hotkey-groups';
import { Hotkey } from 'obsidian';

export type SettingsActions =
    | {
          type: 'settings/documents/set-document-format';
          payload: {
              path: string;
              format: LineageDocumentFormat;
          };
      }
    | {
          type: 'settings/documents/set-view-type';
          payload: {
              path: string;
              type: ViewType;
          };
      }
    | {
          type: 'settings/documents/delete-document-preferences';
          payload: {
              path: string;
          };
      }
    | {
          type: 'settings/documents/update-document-path';
          payload: {
              oldPath: string;
              newPath: string;
          };
      }
    | {
          type: 'settings/hotkeys/update-custom-hotkeys';
          payload: {
              customHotkeys: CustomHotkeys;
          };
      }
    | {
          type: 'settings/view/theme/set-font-size';
          payload: {
              fontSize: number;
          };
      }
    | {
          type: 'settings/view/theme/set-h1-font-size';
          payload: {
              fontSize_em: number;
          };
      }
    | {
          type: 'settings/view/theme/set-container-bg-color';
          payload: {
              backgroundColor: string | undefined;
          };
      }
    | {
          type: 'settings/view/theme/set-active-branch-bg-color';
          payload: {
              backgroundColor: string | undefined;
          };
      }
    | {
          type: 'settings/view/layout/set-card-width';
          payload: {
              width: number;
          };
      }
    | {
          type: 'settings/view/layout/set-cards-gap';
          payload: { gap: number };
      }
    | {
          type: 'settings/view/layout/set-min-card-height';
          payload: {
              height: number | undefined;
          };
      }
    | {
          type: 'settings/view/toggle-horizontal-scrolling-mode';
      }
    | {
          type: 'settings/view/toggle-vertical-scrolling-mode';
      }
    | {
          type: 'settings/view/layout/set-limit-card-height';
          payload: {
              limit: boolean;
          };
      }
    | {
          type: 'settings/documents/remove-stale-documents';
          payload: {
              documents: Record<string, DocumentPreferences>;
          };
      }
    | ChangeZoomLevelAction
    | PersistActiveNodeAction
    | {
          type: 'settings/general/set-default-document-format';
          payload: {
              format: LineageDocumentFormat;
          };
      }
    | {
          type: 'settings/view/toggle-minimap';
      }
    | { type: 'view/left-sidebar/set-width'; payload: { width: number } }
    | {
          type: 'view/left-sidebar/set-active-tab';
          payload: { tab: LeftSidebarTab };
      }
    | {
          type: 'settings/pinned-nodes/persist';
          payload: {
              filePath: string;
              sections: string[];
              section: string;
              fileCategories: string[];
              nodeToCategory: Record<string, string>;
              activeCategory: string;
          };
      }
    | {
          type: 'settings/pinned-nodes/persist-active-node';
          payload: {
              filePath: string;
              section: string;
          };
      }
    | { type: 'view/modes/gap-between-cards/toggle' }
    | { type: 'settings/view/modes/toggle-outline-mode' }
    | { type: 'settings/view/modes/toggle-mindmap-mode' }
    | {
          type: 'settings/style-rules/set-active-tab';
          payload: { tab: RulesTab };
      }
    | StyleRulesAction
    | {
          type: 'settings/view/set-node-indentation-width';
          payload: {
              width: number;
          };
      }
    | {
          type: 'settings/view/set-maintain-edit-mode';
          payload: { maintain: boolean };
      }
    | {
          type: 'settings/view/theme/set-inactive-node-opacity';
          payload: { opacity: number };
      }
    | {
          type: 'settings/view/theme/set-active-branch-color';
          payload: { color: string | undefined };
      }
    | HotkeySettingsActions
    | PersistCollapsedSectionsAction
    | {
          type: 'settings/view/set-always-show-card-buttons';
          payload: {
              show: boolean;
          };
      }
    | {
          type: 'settings/view/vertical-toolbar/set-hidden-button';
          payload: {
              id: ToolbarButton;
              hide: boolean;
          };
      }
    | {
          type: 'settings/general/set-link-pane-type';
          payload: {
              position: LinkPaneType;
          };
      }
    | {
          type: 'settings/categories/global/create-folder';
          payload: {
              parentId: string | null;
              name: string;
          };
      }
    | {
          type: 'settings/categories/global/create-category';
          payload: {
              parentId: string | null;
              name: string;
          };
      }
    | {
          type: 'settings/categories/global/rename';
          payload: {
              id: string;
              name: string;
          };
      }
    | {
          type: 'settings/categories/global/delete';
          payload: {
              id: string;
          };
      }
    | {
          type: 'settings/categories/global/move';
          payload: {
              id: string;
              newParentId: string | null;
              index?: number;
          };
      }
    | {
          type: 'settings/categories/global/add-card';
          payload: {
              categoryId: string;
              filePath: string;
              section: string;
          };
      }
    | {
          type: 'settings/categories/global/remove-card';
          payload: {
              categoryId: string;
              filePath: string;
              section: string;
          };
      }
    | {
          type: 'settings/categories/global/move-card';
          payload: {
              categoryId: string;
              filePath: string;
              section: string;
              toIndex: number;
          };
      }
    | {
          type: 'settings/categories/global/set-enabled';
          payload: {
              enabled: boolean;
          };
      };
export type PersistCollapsedSectionsAction = {
    type: 'settings/document/persist-collapsed-sections';
    payload: {
        path: string;
        sections: string[];
    };
};
export type PersistActiveNodeAction = {
    type: 'settings/document/persist-active-section';
    payload: {
        path: string;
        sectionNumber: string;
    };
};
export type ToggleEditorStateAction = {
    type: 'settings/hotkeys/toggle-editor-state';
    payload: { command: CommandName; type: 'primary' | 'secondary' };
};
export type SetHotkeyBlankAction = {
    type: 'settings/hotkeys/set-blank';
    payload: {
        command: CommandName;
        type: 'primary' | 'secondary';
    };
};
export type HotkeySettingsActions =
    | UpdateHotkeyAction
    | ResetHotkeyAction
    | {
          type: 'settings/hotkeys/reset-all';
      }
    | {
          type: 'settings/hotkeys/apply-preset';
          payload: { preset: CustomHotkeys };
      }
    | ToggleEditorStateAction
    | SetHotkeyBlankAction;
export type UpdateHotkeyAction = {
    type: 'settings/hotkeys/set-custom-hotkey';
    payload: {
        hotkey: Hotkey;
        command: CommandName;
        type: 'primary' | 'secondary';
    };
};
export type ResetHotkeyAction = {
    type: 'settings/hotkeys/reset-custom-hotkey';
    payload: {
        command: CommandName;
        type: 'primary' | 'secondary';
    };
};
