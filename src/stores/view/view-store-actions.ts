import { NavigationAction } from 'src/stores/view/reducers/ui/navigate-active-node';
import { UndoRedoAction } from 'src/stores/view/reducers/history/undo-action';
import { SelectSnapshotAction } from 'src/stores/view/reducers/history/select-snapshot';
import { NodePosition } from 'src/stores/view/helpers/search/find-node-position';
import { SetSearchQueryAction } from 'src/stores/view/reducers/search/set-search-query';
import { SetSearchResultsAction } from 'src/stores/view/reducers/search/set-search-results';
import { LoadDocumentAction } from 'src/stores/view/reducers/document/io/load-document-from-file/load-document-from-file';
import { CreateNodeAction } from 'src/stores/view/reducers/document/structure/insert-node/insert-node';
import { ChangeActiveNodeAction } from 'src/stores/view/reducers/document/state/navigate-using-keyboard';
import { DisableEditModeAction } from 'src/stores/view/reducers/document/state/disable-edit-mode';
import { ToggleEditModeAction } from 'src/stores/view/reducers/document/state/enable-edit-mode';
import { SetNodeContentAction } from 'src/stores/view/reducers/document/content/set-node-content';
import { SetDragStartedAction } from 'src/stores/view/reducers/document/state/on-drag-start';
import { SetDragCanceled } from 'src/stores/view/reducers/document/state/on-drag-end';
import { DropAction } from 'src/stores/view/reducers/document/structure/drop-node/drop-node';
import { DeleteNodeAction } from 'src/stores/view/reducers/document/structure/delete-node/delete-node';
import { MoveNodeAction } from 'src/stores/view/reducers/document/structure/move-node/move-node';
import { MergeNodeAction } from 'src/stores/view/reducers/document/structure/merge-node/merge-node';
import { ToggleSearchInputAction } from 'src/stores/view/reducers/search/toggle-search-input';
import { ChangeZoomLevelAction } from 'src/stores/view/reducers/ui/change-zoom-level';

export type VerticalDirection = 'up' | 'down';
export type Direction = VerticalDirection | 'right';
export type AllDirections = Direction | 'left';
export type SavedDocument = {
    data: string;
    position: NodePosition | null;
    frontmatter: string;
};
type SetActiveNodeAction = {
    type: 'DOCUMENT/SET_ACTIVE_NODE';
    payload: {
        id: string;
    };
};
type ResetStoreAction = { type: 'RESET_STORE' };
type SetFilePathAction = {
    type: 'FS/SET_FILE_PATH';
    payload: {
        path: string | null;
    };
};
type ToggleHistorySidebarAction = {
    type: 'UI/TOGGLE_HISTORY_SIDEBAR';
};
type ToggleHelpSidebarAction = {
    type: 'UI/TOGGLE_HELP_SIDEBAR';
};

export type ViewAction =
    | DocumentAction
    | HistoryAction
    | NavigationAction
    | SearchAction
    | UIActions;

export type DocumentAction =
    | LoadDocumentAction
    | CreateNodeAction
    | ChangeActiveNodeAction
    | SetActiveNodeAction
    | ResetStoreAction
    | DisableEditModeAction
    | ToggleEditModeAction
    | SetNodeContentAction
    | SetDragStartedAction
    | SetDragCanceled
    | DropAction
    | SetFilePathAction
    | DeleteNodeAction
    | MoveNodeAction
    | MergeNodeAction;
export type SearchAction =
    | SetSearchQueryAction
    | SetSearchResultsAction
    | ToggleSearchInputAction;

export type HistoryAction = UndoRedoAction | SelectSnapshotAction;
export type UndoableAction =
    | SetNodeContentAction
    | CreateNodeAction
    | DeleteNodeAction
    | DropAction
    | MoveNodeAction
    | MergeNodeAction
    | LoadDocumentAction;

export type UIActions =
    | ChangeZoomLevelAction
    | ToggleHelpSidebarAction
    | ToggleHistorySidebarAction;
