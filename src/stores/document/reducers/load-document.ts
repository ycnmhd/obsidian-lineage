import { jsonTreeToColumns } from 'src/stores/document/helpers/json-to-md/json-to-columns/json-tree-to-columns';
import { markdownToJson } from 'src/stores/document/helpers/json-to-md/markdown-to-json/markdown-to-json';
import { updateActiveNode } from 'src/stores/document/helpers/update-active-node';
import {
    ColumnNode,
    DocumentState,
    SavedDocument,
} from 'src/stores/document/document-reducer';
import { findNodeAtPosition } from 'src/stores/document/helpers/find-branch';
import { logger } from 'src/helpers/logger';

export type LoadDocumentAction = {
    type: 'LOAD_DATA' | 'APPLY_SNAPSHOT';
    payload: {
        document: SavedDocument;
    };
};
export const loadDocument = (
    state: DocumentState,
    action: LoadDocumentAction,
) => {
    state.columns = jsonTreeToColumns(
        markdownToJson(action.payload.document.data),
    );
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
    if (activeNode) updateActiveNode(state, activeNode.id);
    state.state.editing.savePreviousNode = false;
};
