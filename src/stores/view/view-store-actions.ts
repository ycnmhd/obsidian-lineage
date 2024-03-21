import { SetSearchQueryAction } from 'src/stores/view/reducers/search/set-search-query';
import { SetSearchResultsAction } from 'src/stores/view/reducers/search/set-search-results';
import { ToggleSearchInputAction } from 'src/stores/view/reducers/search/toggle-search-input';
import { ChangeZoomLevelAction } from 'src/stores/view/reducers/ui/change-zoom-level';
import { SetTreeIndex } from 'src/stores/view/reducers/ui/set-tree-index';
import { DisableEditModeAction } from 'src/stores/view/reducers/document/disable-edit-mode';
import { ToggleEditModeAction } from 'src/stores/view/reducers/document/enable-edit-mode';
import { SetDragStartedAction } from 'src/stores/view/reducers/document/on-drag-start';
import { SetDragCanceled } from 'src/stores/view/reducers/document/on-drag-end';
import { UpdateActiveBranchAction } from 'src/stores/view/reducers/document/helpers/update-active-branch';
import { JumpToNodeAction } from 'src/stores/view/reducers/document/jump-to-node';
import { ChangeActiveNodeAction } from 'src/stores/view/reducers/document/navigate-using-keyboard';
import { NavigationAction } from 'src/stores/view/reducers/ui/navigate-active-node';

export type ViewStoreAction =
    | SearchAction
    | ViewUIAction
    | ViewDocumentAction
    | NodeSelectionAction
    | NavigationAction;

export type SearchAction =
    | SetSearchQueryAction
    | SetSearchResultsAction
    | ToggleSearchInputAction;

export type ViewUIAction =
    | ChangeZoomLevelAction
    | ToggleHelpSidebarAction
    | ToggleHistorySidebarAction
    | SetTreeIndex;

export type ViewDocumentAction =
    | DisableEditModeAction
    | ToggleEditModeAction
    | SetDragStartedAction
    | SetDragCanceled
    | UpdateActiveBranchAction;
type ToggleHistorySidebarAction = {
    type: 'UI/TOGGLE_HISTORY_SIDEBAR';
};
type ToggleHelpSidebarAction = {
    type: 'UI/TOGGLE_HELP_SIDEBAR';
};
type SetActiveNodeAction = {
    type: 'DOCUMENT/SET_ACTIVE_NODE';
    payload: {
        id: string;
    };
};
export type NodeSelectionAction =
    | JumpToNodeAction
    | ChangeActiveNodeAction
    | SetActiveNodeAction;
