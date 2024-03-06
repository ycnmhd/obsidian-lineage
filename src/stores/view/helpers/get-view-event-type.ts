import { ViewAction } from 'src/stores/view/view-reducer';

const structureAndContentEvents = new Set<ViewAction['type']>([
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
const historyEvents = new Set<ViewAction['type']>([
    'HISTORY/APPLY_NEXT_SNAPSHOT',
    'HISTORY/APPLY_PREVIOUS_SNAPSHOT',
    'HISTORY/SELECT_SNAPSHOT',
]);

const navigationEvents = new Set<ViewAction['type']>([
    'NAVIGATION/NAVIGATE_BACK',
    'NAVIGATION/NAVIGATE_FORWARD',
]);

const cachedResults: { [key: string]: EventType } = {};

type EventType = {
    structureAndContent: boolean;
    activeNodeHistory: boolean;
    changeHistory: boolean;
    activeNode: boolean;
};
export const getViewEventType = (type: ViewAction['type']): EventType => {
    if (cachedResults[type]) {
        return cachedResults[type];
    }

    const structureAndContent = structureAndContentEvents.has(type);
    const activeNodeHistory =
        !structureAndContent && navigationEvents.has(type);
    const changeHistory = !activeNodeHistory && historyEvents.has(type);
    const activeNode = !changeHistory && stateEvents.has(type);

    const result: EventType = {
        structureAndContent,
        activeNodeHistory,
        changeHistory,
        activeNode,
    };

    cachedResults[type] = result;

    return result;
};
