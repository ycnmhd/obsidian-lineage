import { DocumentStoreAction } from 'src/stores/document/document-store-actions';

const contentEvents = new Set<ActionType>([
    'DOCUMENT/SET_NODE_CONTENT',
    'DOCUMENT/FORMAT_HEADINGS',
]);

const createAndDelete = new Set<ActionType>([
    'DOCUMENT/INSERT_NODE',
    'DOCUMENT/DELETE_NODE',
    'DOCUMENT/MERGE_NODE',
    'DOCUMENT/LOAD_FILE',
    'DOCUMENT/EXTRACT_BRANCH',
    'DOCUMENT/SPLIT_NODE',
]);

const dropAndMoveEvents = new Set<ActionType>([
    'DOCUMENT/DROP_NODE',
    'DOCUMENT/MOVE_NODE',
]);

const historyEvents = new Set<ActionType>([
    'HISTORY/APPLY_NEXT_SNAPSHOT',
    'HISTORY/APPLY_PREVIOUS_SNAPSHOT',
    'HISTORY/SELECT_SNAPSHOT',
]);
const clipboardEvents = new Set<ActionType>([
    'DOCUMENT/PASTE_NODE',
    'DOCUMENT/CUT_NODE',
]);

const cachedResults: { [key: string]: DocumentEventType } = {};

export type DocumentEventType = {
    content?: boolean;
    dropOrMove?: boolean;
    createOrDelete?: boolean;
    changeHistory?: boolean;
    clipboard?: boolean;
};
type ActionType = DocumentStoreAction['type'];
export const getDocumentEventType = (type: ActionType): DocumentEventType => {
    if (cachedResults[type]) {
        return cachedResults[type];
    }

    let result: DocumentEventType | null = null;
    if (contentEvents.has(type)) result = { content: true };
    else if (createAndDelete.has(type)) result = { createOrDelete: true };
    else if (dropAndMoveEvents.has(type)) result = { dropOrMove: true };
    else if (historyEvents.has(type)) result = { changeHistory: true };
    else if (clipboardEvents.has(type)) result = { clipboard: true };
    if (!result) result = {};

    cachedResults[type] = result;

    return result;
};
