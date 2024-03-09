import { id } from 'src/helpers/id';
import { DocumentState, Snapshot } from 'src/stores/view/view-state-type';
import { UndoableAction } from 'src/stores/view/view-store-actions';

export const createSnapshot = (
    document: DocumentState,
    action: UndoableAction,
) => {
    return {
        // 🤮
        data: {
            columns: JSON.stringify(document.columns),
            content: JSON.stringify(document.content),
            state: JSON.stringify(document.state),
        },
        created: Date.now(),
        id: id.snapshot(),
        action: action,
    } as Snapshot;
};
