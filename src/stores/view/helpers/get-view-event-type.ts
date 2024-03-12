import { ViewAction } from 'src/stores/view/view-store-actions';

const contentEvents = new Set<ViewAction['type']>([
    'DOCUMENT/SET_NODE_CONTENT',
]);

const creationAndDeletionEvents = new Set<ViewAction['type']>([
    'DOCUMENT/INSERT_NODE',
    'DOCUMENT/DELETE_NODE',
    'DOCUMENT/MERGE_NODE',
    'DOCUMENT/LOAD_FILE',
]);

const shapeEvents = new Set<ViewAction['type']>([
    'DOCUMENT/DROP_NODE',
    'DOCUMENT/MOVE_NODE',
]);
export const stateEvents = new Set<ViewAction['type']>([
    'DOCUMENT/SET_ACTIVE_NODE',
    'DOCUMENT/NAVIGATE_USING_KEYBOARD',
    'DOCUMENT/JUMP_TO_NODE',
]);
const historyEvents = new Set<ViewAction['type']>([
    'HISTORY/APPLY_NEXT_SNAPSHOT',
    'HISTORY/APPLY_PREVIOUS_SNAPSHOT',
    'HISTORY/SELECT_SNAPSHOT',
]);

const navigationEvents = new Set<ViewAction['type']>([
    'NAVIGATION/NAVIGATE_BACK',
    'NAVIGATION/NAVIGATE_FORWARD',
]);

const searchEvents = new Set<ViewAction['type']>([
    'SEARCH/SET_QUERY',
    'SEARCH/SET_RESULTS',
]);
const zoomEvents = new Set<ViewAction['type']>(['UI/CHANGE_ZOOM_LEVEL']);

const cachedResults: { [key: string]: EventType } = {};

export type EventType = {
    content?: boolean;
    shape?: boolean;
    creationAndDeletion?: boolean;
    activeNodeHistory?: boolean;
    changeHistory?: boolean;
    activeNode?: boolean;
    search?: boolean;
    zoom?: boolean;
};
export const getViewEventType = (type: ViewAction['type']): EventType => {
    if (cachedResults[type]) {
        return cachedResults[type];
    }

    let result: EventType | null = null;
    if (contentEvents.has(type)) result = { content: true };
    else if (creationAndDeletionEvents.has(type))
        result = { creationAndDeletion: true };
    else if (shapeEvents.has(type)) result = { shape: true };
    else if (navigationEvents.has(type)) result = { activeNodeHistory: true };
    else if (historyEvents.has(type)) result = { changeHistory: true };
    else if (stateEvents.has(type)) result = { activeNode: true };
    else if (searchEvents.has(type)) result = { search: true };
    else if (zoomEvents.has(type)) result = { zoom: true };
    if (!result) result = {};

    cachedResults[type] = result;

    return result;
};
