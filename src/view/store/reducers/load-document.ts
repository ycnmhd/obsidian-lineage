import { jsonTreeToColumns } from 'src/view/store/helpers/conversion/json-to-columns/json-tree-to-columns';
import { markdownToJson } from 'src/view/store/helpers/conversion/markdown-to-json/markdown-to-json';
import { updateActiveNode } from 'src/view/store/helpers/update-active-node';
import {
    ColumnNode,
    DocumentState,
    SavedDocument,
} from 'src/view/store/document-reducer';
import { findNodeAtPosition } from 'src/view/store/helpers/find-branch';

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
    } else activeNode = state.columns[0]?.groups?.[0]?.nodes?.[0];
    if (activeNode) updateActiveNode(state, activeNode.id);
};
