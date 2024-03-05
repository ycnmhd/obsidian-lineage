import { ViewAction } from 'src/stores/view/view-reducer';
import { SetNodeContentAction } from 'src/stores/view/reducers/document/content/set-node-content';
import { CreateNodeAction } from 'src/stores/view/reducers/document/structure/insert-node/insert-node';
import { DeleteNodeAction } from 'src/stores/view/reducers/document/structure/delete-node/delete-node';
import { MoveNodeAction } from 'src/stores/view/reducers/document/structure/move-node/move-node';
import { DropAction } from 'src/stores/view/reducers/document/structure/drop-node/drop-node';
import { MergeNodeAction } from 'src/stores/view/reducers/document/structure/merge-node/merge-node';
import { LoadDocumentAction } from 'src/stores/view/reducers/document/io/load-document-from-file/load-document-from-file';

export type UndoableAction =
    | SetNodeContentAction
    | CreateNodeAction
    | DeleteNodeAction
    | DropAction
    | MoveNodeAction
    | MergeNodeAction
    | LoadDocumentAction;
export const structureAndContentEvents = new Set<ViewAction['type']>([
    'DOCUMENT/SET_NODE_CONTENT',
    'DOCUMENT/INSERT_NODE',
    'DOCUMENT/DELETE_NODE',
    'DOCUMENT/DROP_NODE',
    'DOCUMENT/MOVE_NODE',
    'DOCUMENT/MERGE_NODE',
    'DOCUMENT/LOAD_FILE',
]);
export const stateEvents = new Set<ViewAction['type']>([
    'DOCUMENT/SET_ACTIVE_NODE',
    'DOCUMENT/NAVIGATE_USING_KEYBOARD',
]);
export const historyEvents = new Set<ViewAction['type']>([
    'HISTORY/APPLY_NEXT_SNAPSHOT',
    'HISTORY/APPLY_PREVIOUS_SNAPSHOT',
    'HISTORY/SELECT_SNAPSHOT',
]);

export const navigationEvents = new Set<ViewAction['type']>([
    'NAVIGATION/NAVIGATE_BACK',
    'NAVIGATION/NAVIGATE_FORWARD',
]);
