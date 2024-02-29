import {
    ColumnNode,
    DocumentState,
} from 'src/stores/document/document-reducer';
import { findNodeAtPosition } from 'src/stores/document/helpers/find-branch';
import { logger } from 'src/helpers/logger';
import { LoadDocumentAction } from 'src/stores/document/reducers/file/load-document/load-document';

export const findInitialActiveNode = (
    state: DocumentState,
    action: LoadDocumentAction,
) => {
    let activeNode: ColumnNode | null;
    if (action.payload.document.position) {
        activeNode = findNodeAtPosition(
            state.columns,
            action.payload.document.position,
        );
        if (!activeNode) {
            const message =
                'could not find node at position' +
                JSON.stringify({
                    state,
                    action,
                });
            logger.error(message);
        }
    } else activeNode = state.columns[0]?.groups?.[0]?.nodes?.[0];
    return activeNode;
};
