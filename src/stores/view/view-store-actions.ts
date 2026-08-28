import { SetSearchQueryAction } from 'src/stores/view/reducers/search/set-search-query';
import { SetSearchResultsAction } from 'src/stores/view/reducers/search/set-search-results';
import { ToggleSearchInputAction } from 'src/stores/view/reducers/search/toggle-search-input';
import { SetDragStartedAction } from 'src/stores/view/reducers/document/on-drag-start';
import { SetDragCanceled } from 'src/stores/view/reducers/document/on-drag-end';
import { UpdateActiveBranchAction } from 'src/stores/view/reducers/document/helpers/update-active-branch';
import { JumpToNodeAction } from 'src/stores/view/reducers/document/jump-to-node';
import { ChangeActiveNodeAction } from 'src/stores/view/reducers/document/navigate-using-keyboard';
import { NodeHistoryNavigationAction } from 'src/stores/view/reducers/ui/navigate-active-node-history';
import { ToggleFuzzySearchAction } from 'src/stores/view/reducers/search/toggle-fuzzy-search';
import { NodeNavigationAction } from 'src/stores/view/reducers/ui/navigate-active-node';
import { SetActivePinnedNodeAction } from 'src/stores/view/reducers/pinned-cards/set-active-pinned-node';
import { SetActiveRecentNodeAction } from 'src/stores/view/reducers/recent-nodes/set-active-recent-node';
import { ToggleShowAllNodesAction } from 'src/stores/view/reducers/search/toggle-show-all-nodes';
import { StyleRulesResult } from 'src/stores/view/subscriptions/effects/style-rules/helpers/process-style-rules';
import { LeftSidebarTab } from 'src/stores/settings/settings-type';
import { ConflictingHotkeys } from 'src/obsidian/helpers/get-used-hotkeys';
import { SelectAllNodesAction } from 'src/stores/view/reducers/selection/select-all-nodes';

export type ViewStoreAction =
    | SearchAction
    | ViewUIAction
    | ViewDocumentAction
    | NodeSelectionAction
    | NodeHistoryNavigationAction
    | SidebarActions
    | StyleRulesViewActions
    | KeyboardEventAction
    | ViewHotkeysAction
    | OutlineAction
    | SelectionActions
    | PersistedStateActions
    | SimilarCardsActions;

export type SearchAction =
    | SetSearchQueryAction
    | SetSearchResultsAction
    | ToggleSearchInputAction
    | ToggleFuzzySearchAction
    | ToggleShowAllNodesAction;

export type ViewUIAction =
    | ToggleHelpSidebarAction
    | ToggleHistorySidebarAction
    | ToggleSettingsSidebarAction
    | ToggleLeftSidebarAction
    | { type: 'view/close-modals'; payload?: { closeAllModals: boolean } }
    | { type: 'view/style-rules/toggle-modal' };

export type ToggleEditModeAction = {
    type: 'view/editor/enable-main-editor';
    payload: {
        nodeId: string;
    };
};

export type DisableEditModeAction = {
    type: 'view/editor/disable-main-editor';
    context?: {
        modKey?: boolean;
    };
};

export type ViewDocumentAction =
    | DisableEditModeAction
    | ToggleEditModeAction
    | SetDragStartedAction
    | SetDragCanceled
    | UpdateActiveBranchAction
    | {
          type: 'view/editor/disable/reset-confirmation';
      }
    | {
          type: 'view/delete-node/reset-confirmation';
      }
    | {
          type: 'view/delete-node/confirm';
          payload: {
              id: string;
              includeSelection?: boolean;
          };
      }
    | {
          type: 'view/editor/disable/confirm';
          payload: {
              id: string;
          };
      }
    | { type: 'view/selection/clear-selection' };
type ToggleHistorySidebarAction = {
    type: 'view/snapshots/toggle-modal';
};
type ToggleHelpSidebarAction = {
    type: 'view/hotkeys/toggle-modal';
};
type ToggleSettingsSidebarAction = {
    type: 'view/settings/toggle-modal';
};
type ToggleLeftSidebarAction = {
    type: 'view/left-sidebar/toggle';
};
type SetActiveNodeAction = {
    type: `view/set-active-node/${'mouse' | 'mouse-silent' | 'search' | 'document'}`;
    payload: {
        id: string;
    };
};
export type NodeSelectionAction =
    | JumpToNodeAction
    | ChangeActiveNodeAction
    | SetActiveNodeAction
    | NodeNavigationAction
    | SelectAllNodesAction;

export type SidebarActions =
    | PinnedNodesActions
    | RecentNodesActions
    | EnableEditInSidebar
    | DisableEditInSidebar;

export type PinnedNodesActions =
    | SetActivePinnedNodeAction
    | {
          type: 'view/pinned-nodes/set-active-category';
          payload: { category: string };
      };
export type RecentNodesActions = SetActiveRecentNodeAction;

export type EnableEditInSidebar = {
    type: 'view/editor/enable-sidebar-editor';
    payload: {
        id: string;
    };
    context: {
        activeSidebarTab: LeftSidebarTab;
    };
};

export type DisableEditInSidebar = {
    type: 'view/editor/disable-sidebar-editor';
    context?: {
        modKey?: boolean;
    };
};

export type StyleRulesViewActions = UpdateStyleRulesResultAction;

export type UpdateStyleRulesResultAction = {
    type: 'view/style-rules/update-results';
    payload: {
        results: StyleRulesResult | null;
    };
};

export type KeyboardEventAction =
    | {
          type: 'view/keyboard/shift/down';
      }
    | {
          type: 'view/keyboard/shift/up';
      };

export type ViewHotkeysAction =
    | SetSearchTermAction
    | UpdateConflictingHotkeysAction;
export type SetSearchTermAction = {
    type: 'view/hotkeys/set-search-term';
    payload: {
        searchTerm: string;
    };
};
export type UpdateConflictingHotkeysAction = {
    type: 'view/hotkeys/update-conflicts';
    payload: {
        conflicts: ConflictingHotkeys;
    };
};

export type OutlineAction =
    | {
          type: 'view/outline/toggle-collapse-node';
          payload: { id: string };
      }
    | {
          type: 'view/outline/refresh-collapsed-nodes';
      }
    | {
          type: 'view/outline/toggle-collapse-all';
      };

export type SelectionActions = {
    type: 'view/selection/set-selection';
    payload: { ids: string[] };
};

export type PersistedStateActions = {
    type: 'view/outline/load-persisted-collapsed-parents';
    payload: {
        collapsedIds: string[];
    };
};

export type SimilarCardsActions =
    | {
          type: 'view/similar-cards/set-results';
          payload: {
              nodeIds: string[];
              scores: Map<string, number>;
              query: string;
          };
      }
    | {
          type: 'view/similar-cards/set-loading';
          payload: { loading: boolean };
      }
    | {
          type: 'view/similar-cards/clear';
      };
