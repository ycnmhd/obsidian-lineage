import { DocumentStoreAction } from 'src/stores/document/document-store-actions';

const contentEvents = new Set<ActionType>(['DOCUMENT/SET_NODE_CONTENT']);

const creationAndDeletionEvents = new Set<ActionType>([
    'DOCUMENT/INSERT_NODE',
    'DOCUMENT/DELETE_NODE',
    'DOCUMENT/MERGE_NODE',
    'DOCUMENT/LOAD_FILE',
]);

const shapeEvents = new Set<ActionType>([
    'DOCUMENT/DROP_NODE',
    'DOCUMENT/MOVE_NODE',
]);

const historyEvents = new Set<ActionType>([
    'HISTORY/APPLY_NEXT_SNAPSHOT',
    'HISTORY/APPLY_PREVIOUS_SNAPSHOT',
    'HISTORY/SELECT_SNAPSHOT',
]);

const cachedResults: { [key: string]: DocumentEventType } = {};

export type DocumentEventType = {
    content?: boolean;
    shape?: boolean;
    creationAndDeletion?: boolean;
    changeHistory?: boolean;
};
type ActionType = DocumentStoreAction['type'];
export const getDocumentEventType = (type: ActionType): DocumentEventType => {
    if (cachedResults[type]) {
        return cachedResults[type];
    }

    let result: DocumentEventType | null = null;
    if (contentEvents.has(type)) result = { content: true };
    else if (creationAndDeletionEvents.has(type))
        result = { creationAndDeletion: true };
    else if (shapeEvents.has(type)) result = { shape: true };
    else if (historyEvents.has(type)) result = { changeHistory: true };
    if (!result) result = {};

    cachedResults[type] = result;

    return result;
};
