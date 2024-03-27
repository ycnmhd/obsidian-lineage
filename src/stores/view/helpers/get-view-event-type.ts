import { ViewStoreAction } from 'src/stores/view/view-store-actions';

type ActionType = ViewStoreAction['type'];
const navigationEvents = new Set<ActionType>([
    'NAVIGATION/NAVIGATE_BACK',
    'NAVIGATION/NAVIGATE_FORWARD',
]);

const searchEvents = new Set<ActionType>([
    'SEARCH/SET_QUERY',
    'SEARCH/SET_RESULTS',
]);
const zoomEvents = new Set<ActionType>(['UI/CHANGE_ZOOM_LEVEL']);

export const stateEvents = new Set<ActionType>([
    'DOCUMENT/SET_ACTIVE_NODE',
    'DOCUMENT/NAVIGATE_USING_KEYBOARD',
    'DOCUMENT/JUMP_TO_NODE',
]);

export type ViewEventType = {
    activeNodeHistory?: boolean;
    activeNode?: boolean;
    search?: boolean;
    zoom?: boolean;
};
const cachedResults: { [key: string]: ViewEventType } = {};

export const getViewEventType = (type: ActionType): ViewEventType => {
    if (cachedResults[type]) {
        return cachedResults[type];
    }

    let result: ViewEventType | null = null;

    if (navigationEvents.has(type)) result = { activeNodeHistory: true };
    else if (stateEvents.has(type)) result = { activeNode: true };
    else if (searchEvents.has(type)) result = { search: true };
    else if (zoomEvents.has(type)) result = { zoom: true };
    if (!result) result = {};

    cachedResults[type] = result;

    return result;
};
