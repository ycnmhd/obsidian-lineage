import { id } from 'src/helpers/id';
import {
    LineageDocument,
    Snapshot,
} from 'src/stores/document/document-state-type';
import { UndoableAction } from 'src/stores/document/document-store-actions';

export const createSnapshot = (
    document: LineageDocument,
    action: UndoableAction,
    activeNodeId: string,
) => {
    return {
        data: {
            columns: JSON.stringify(document.columns),
            content: JSON.stringify(document.content),
            activeNodeId,
        },
        created: Date.now(),
        id: id.snapshot(),
        action: action,
    } as Snapshot;
};
