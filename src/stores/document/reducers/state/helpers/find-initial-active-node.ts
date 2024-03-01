import { findNodeAtPosition } from 'src/stores/document/helpers/search/find-node-at-position';
import { logger } from 'src/helpers/logger';
import { LoadDocumentAction } from 'src/stores/document/reducers/file/load-document/load-document';
import { ColumnNode, DocumentState } from 'src/stores/document/document-type';

export const findInitialActiveNode = (
    state: DocumentState,
    action: LoadDocumentAction,
) => {
    let activeNode: ColumnNode | null;
    if (action.payload.document.position) {
        activeNode = findNodeAtPosition(
            state.document.columns,
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
    } else activeNode = state.document.columns[0]?.groups?.[0]?.nodes?.[0];
    return activeNode;
};
