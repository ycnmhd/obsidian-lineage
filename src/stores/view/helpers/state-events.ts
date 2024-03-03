import { ViewAction } from 'src/stores/view/view-reducer';

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
    'HISTORY/SELECT_SNAPSHOT',
    'HISTORY/UNDO_REDO_SNAPSHOT',
]);
